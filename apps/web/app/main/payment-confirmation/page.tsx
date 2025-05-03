'use client';

import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

import { TypedRoutes } from '~/lib/routes';

export default function PaymentConfirmationPage() {
  return (
    <div className="h-full">
      <div className="flex h-full flex-col justify-center space-y-8">
        <div className="inline bg-gradient-to-r from-[#6fe9b2] to-[#19f039] bg-clip-text text-center text-5xl font-bold text-transparent">
          {/* <Confetti className="absolute left-0 top-0 z-0 ml-20 size-full" /> */}
          Welcome to the Harvester community!
        </div>
        <div className="z-10 text-center text-accent-foreground">
          We look forward to building an optimized portfolio with you.
          {' '}
          <Link href={TypedRoutes.home()}>
            <Button iconRight={<ArrowRightIcon />}>Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
