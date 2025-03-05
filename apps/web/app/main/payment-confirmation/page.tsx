import { HOME } from 'constants/routes';

import { ArrowRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Button, Confetti } from 'ui';

export default function PaymentConfirmationPage() {
  return (
    <div className="h-full">
      <div className="flex h-full flex-col justify-center space-y-8">
        <div className="inline bg-gradient-to-r from-[#6fe9b2] to-[#19f039] bg-clip-text text-center text-5xl font-bold text-transparent">
          <Confetti className="absolute left-0 top-0 z-0 ml-20 size-full" />
          Welcome to the Harvester community!
        </div>
        <div className="text-accent-foreground z-10 text-center">
          We look forward to building an optimized portfolio with you.{' '}
          <Link href={HOME}>
            <Button iconRight={<ArrowRightIcon />}>Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
