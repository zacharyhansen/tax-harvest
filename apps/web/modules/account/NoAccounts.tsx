import { Wheat } from 'lucide-react';
import Link from 'next/link';

import { PlaidConnectButton } from '../plaid';

export default function NoAccounts() {
  return (
    <>
      <div className="bg-primary mx-auto flex h-80 w-80 items-center justify-center rounded-full">
        <Wheat className="h-[30%] w-[30%]" />
      </div>
      <div className="text-center">
        <h1 className="mt-4 text-lg font-bold tracking-tight sm:text-3xl">
          Connect your first account to start Harvesting
        </h1>
        <p className="text-accent-foreground mt-6 text-base leading-7">
          Once connected, we can harvest tax savings over the lifetime of the
          account.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <PlaidConnectButton />
          <Link href="https://www.taxharvest.ai/" target="_blank">
            Find out more <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </>
  );
}
