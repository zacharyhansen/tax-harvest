import type { ReactNode } from 'react';
import { Button } from '@repo/ui/components/button';
import { CircleAlert } from 'lucide-react';
import Link from 'next/link';

import { TypedRoutes } from '~/lib/routes';

export function ErrorPage({
  title,
  message,
  children,
}: {
  title?: ReactNode;
  message?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="text-card-foreground grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <div className="flex justify-center space-x-2 align-middle text-xl font-bold text-red-600">
          <CircleAlert className="inline" />
          <p>{title ?? 'Error'}</p>
        </div>
        <div className="text-muted-foreground text-sm">
          {message ?? 'Something went wrong. Please try again later.'}
        </div>
        {children}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href={TypedRoutes.home()}>
            <Button variant="outline">Go back home</Button>
          </Link>
          <button
            className="text-accent-foreground text-sm font-semibold"
            type="button"
          >
            Contact support <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
