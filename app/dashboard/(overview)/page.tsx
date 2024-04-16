//dashboard page

import { lusitana } from "../../ui/fonts";
import CardWrapper, { Card } from '@/app/ui/dashboard/cards'
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { fetchCardData, fetchLatestInvoices, fetchRevenue } from "../../lib/data";

//this page is async so we can use await to fetch data 

export default async function Page() {
    const revenue = await fetchRevenue();
    const latestInvoices = await fetchLatestInvoices();
    const cardData = await fetchCardData();

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2x1`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardWrapper></CardWrapper>
                {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> */}
                {/* <Card title="Pending" value={totalPendingInvoices} type="pending" /> */}
                {/* <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
                {/* <Card
                    title="Total Customers"
                    value={numberOfCustomers}
                    type="customers"
                /> */}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <RevenueChart revenue={revenue}/>
                <LatestInvoices latestInvoices={latestInvoices}/>
            </div>
        </main>
    );
}