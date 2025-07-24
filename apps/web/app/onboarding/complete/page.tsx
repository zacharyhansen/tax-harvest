'use client';

import { Button } from '@repo/ui/components/button';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client';
import { PortfolioSummaryDocument } from '~/generated/gql';
import { OnboardingCompleteStep } from '~/components/onboarding-complete-step';

export default function CompletePage() {
  const router = useRouter();
  const client = useApolloClient();

  const handleComplete = () => {
    client.refetchQueries({
      include: [PortfolioSummaryDocument],
    });
  };

  return (
    <div className="mx-auto max-h-screen w-full max-w-4xl overflow-auto">
      <div className="bg-card rounded-lg border">
        <div className="border-b p-6">
          <h1 className="text-2xl font-semibold">Complete</h1>
          <p className="text-muted-foreground mt-1">
            Your account is ready to go!
          </p>
        </div>

        <OnboardingCompleteStep />

        <div className="flex justify-end gap-2 border-t p-6">
          <Button
            variant="outline"
            onClick={() => router.push('/onboarding/analyze')}
          >
            Back
          </Button>
          <Button
            onClick={() => {
              handleComplete();
              router.push('/onboarding/plaid');
            }}
          >
            Connect Plaid
          </Button>
        </div>
      </div>
    </div>
  );
}
