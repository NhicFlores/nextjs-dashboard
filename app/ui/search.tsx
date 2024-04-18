'use client';
//client side component -> can use event listeners and hooks 

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  //NOTE HOW TO use debouncer
  const handleSearch = useDebouncedCallback((term) => {

    console.log(`Searching ... ${term}`);

    //URLSearchParams: web api that provides utility methods for manipulating the URL query parameters 
    const params = new URLSearchParams(searchParams);

    /*
    When to use the useSearchParams() hook vs. the searchParams prop?

    <Search> is a Client Component, so you used the useSearchParams() hook to access the params from the client.
    <Table> is a Server Component that fetches its own data, so you can pass the searchParams prop from the page to the component.
    As a general rule, if you want to read the params from the client, use the useSearchParams() hook as this avoids having to go back to the server. 
    */

    if (term) {
      params.set('query', term);
    }
    else {
      params.delete('query');
    }
    replace(`${pathName}?${params.toString()}`);
    console.log(term);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
