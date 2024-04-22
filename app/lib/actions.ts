'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customer_id: z.string({
        invalid_type_error: 'Please select a customer',
    }),//in tutorial this is customerID - we had an issue with mismatched labels and names
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.'}),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true});

// this is temporary untul @types/react-dom is updated
export type State = {
    errors?: {
        customer_id?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};
//prevState contains state passed from the useFormState hook - not being used in this example, 
// but it is a required prop 
export async function createInvoice(prevState: State, formData: FormData) {
    // console.log('server action: create invoice');
    // //Test 
    // console.log('TESTING FORM DATA');
    // const testRawFormData = {
    //     customer_id: formData.get('customer_id'),
    //     amount: formData.get('amount'),
    //     status: formData.get('status'),
    // };
    
    // console.log(testRawFormData);
    // console.log(testRawFormData.status);
    // console.log(typeof testRawFormData.amount);
    //const customer_id = '3958dc9e-712f-4377-85e9-fec4b6a6442a'
    
    //NOTE HOW TO get form values - 
    //here we are using the get(name) method to extract the values 
    //there are other methods - https://developer.mozilla.org/en-US/docs/Web/API/FormData/append 
    const validatedFields = CreateInvoice.safeParse({
        customer_id: formData.get('customer_id'),//to match tutorial this would be customerID: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    //safeParse will return an object containing either a success or error field which allows us to handle 
    //validation more gracefully without having to put this logic inside the try/catch block 
    console.log(validatedFields);
    if(!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to create Invoice.',
        }
    }

    const { customer_id, amount, status } = validatedFields.data;

    //NOTE good practice to store monetary values in cents in your database 
    //to eliminate JavaScript floating-point errors 
    //and ensure greater accuracy
    //amount in cents 
    const amountInCents = amount * 100;
    //date with the format "YYYY-MM-DD"
    const date = new Date().toISOString().split('T')[0];
    try{
        await sql `
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customer_id},${amountInCents},${status},${date})
    `;
    } catch (err) {
        return {
            message: 'Database Error: Failed to Create Invoice',
        };
    }
    
    //NOTE TO DO still need error handling 

    revalidatePath('/dashboard/invoices');
    //console.log("path revalidated");
    redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true});

export async function updateInvoice(id: string, prevState: State, formData: FormData){

    const validatedFields = UpdateInvoice.safeParse({
        customer_id: formData.get('customer_id'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if(!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to update Invoice',
        }
    }

    const { customer_id, amount, status } = validatedFields.data;

    const amountInCents = amount * 100;

    try{
        await sql`
            UPDATE invoices
            SET customer_id = ${customer_id}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (err) {
        return {
            message: 'Database Error: Failed to update Invoice',
        }
    }


    revalidatePath('/dashboard/invoices/');
    redirect('/dashboard/invoices/');
}

export async function deleteInvoice(id: string){
    
    try {
        await sql`
            DELETE FROM invoices
            WHERE id = ${id}
        `;
    } catch (err) {
        return {
            message: 'Database Error: Failed to Delete Invoice',
        };
    }

    revalidatePath('/dashboard/invoices/');
}