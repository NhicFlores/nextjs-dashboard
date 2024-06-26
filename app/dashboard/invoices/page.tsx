// invoices page 

import { Metadata } from 'next';
 
export const metadata: Metadata = {
  // title: 'Invoices | Acme Dashboard', //this hard codes the company title, so you'd have multiple places if you have to make a change 
  // make a template in the root layout 
  title: 'Invoices',
}; 

import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
 
export default async function Page({searchParams}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {

  const query = searchParams?.query || '';
  const currPage = Number(searchParams?.page) || 1;
  const allPages = await fetchInvoicesPages(query);
  // returns the total number of pages based on the search query. 
  // For example, if there are 12 invoices that match the search query, and each page displays 6 invoices, then the total number of pages would be 2.

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={allPages} />
      </div>
    </div>
  );
}