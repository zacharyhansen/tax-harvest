'use client';

import { Button } from '@repo/ui/components/button';
import { Shield, LineChart, Lock, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePlaidLinkTokenQuery } from '~/generated/gql';
import PlaidLink from '~/modules/plaid/PlaidLink';
import { LoadingIcon } from '~/modules/utility-components';

const features = [
  {
    icon: <Shield className="text-primary h-5 w-5" />,
    title: 'Bank-Level Security',
    description: 'Your data is encrypted and protected',
  },
  {
    icon: <Building2 className="text-primary h-5 w-5" />,
    title: 'Trusted by Banks',
    description: 'Connect to 12,000+ institutions',
  },
  {
    icon: <LineChart className="text-primary h-5 w-5" />,
    title: 'Smart Tax Harvesting',
    description: 'Identify opportunities automatically',
  },
  {
    icon: <Lock className="text-primary h-5 w-5" />,
    title: 'Data Privacy',
    description: 'Disconnect anytime',
  },
];

export default function PlaidPage() {
  const router = useRouter();
  const { data } = usePlaidLinkTokenQuery();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="bg-card rounded-lg border">
        <div className="border-b p-6">
          <h1 className="text-2xl font-semibold">Connect Your Accounts</h1>
          <p className="text-muted-foreground mt-1">
            Securely connect your brokerage accounts to enable automatic
            tax-loss harvesting identification
          </p>
        </div>

        <div className="p-8">
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-3">
                <div className="mt-1">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {data?.linkToken ? (
            <PlaidLink
              token={data.linkToken}
              redirectTo="/main/home"
              size="lg"
              variant="default"
              className="w-full"
            />
          ) : (
            <LoadingIcon className="mx-auto my-4" />
          )}
        </div>

        <div className="flex justify-between gap-2 border-t p-6">
          <Button
            variant="outline"
            onClick={() => router.push('/onboarding/complete')}
          >
            Back
          </Button>
          <Button variant="outline" onClick={() => router.push('/main/home')}>
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}
