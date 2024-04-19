'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customer_id: z.string(),//in tutorial this is customerID - we had an issue with mismatched labels and names
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true});

export async function createInvoice(formData: FormData) {
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
    const { customer_id, amount, status } = CreateInvoice.parse({
        customer_id: formData.get('customer_id'),//to match tutorial this would be customerID: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    
    //NOTE good practice to store monetary values in cents in your database 
    //to eliminate JavaScript floating-point errors 
    //and ensure greater accuracy
    //amount in cents 
    const amountInCents = amount * 100;
    //date with the format "YYYY-MM-DD"
    const date = new Date().toISOString().split('T')[0];

    await sql `
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customer_id},${amountInCents},${status},${date})
    `;
    //NOTE TO DO still need error handling 

    revalidatePath('/dashboard/invoices');
    console.log("path revalidated");
    redirect('/dashboard/invoices');
}