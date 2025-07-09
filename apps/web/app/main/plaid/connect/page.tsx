'use client';

import { Card } from '@repo/ui/components/card';
import { Shield, LineChart, Lock } from 'lucide-react';
import { Building2 } from 'lucide-react';

import PlaidConnectButton from '~/modules/plaid/PlaidConnectButton';

const features = [
  {
    icon: <Shield className="text-primary h-6 w-6" />,
    title: 'Bank-Level Security',
    description:
      'Your data is encrypted and protected using industry-leading security standards',
  },
  {
    icon: <Building2 className="text-primary h-6 w-6" />,
    title: 'Trusted by Banks',
    description: 'Connect securely to over 12,000 financial institutions',
  },
  {
    icon: <LineChart className="text-primary h-6 w-6" />,
    title: 'Smart Tax Harvesting',
    description:
      'Automatically identify tax-loss harvesting opportunities across your portfolio',
  },
  {
    icon: <Lock className="text-primary h-6 w-6" />,
    title: 'Data Privacy',
    description:
      'We never store your bank credentials and you can disconnect anytime',
  },
];

export default function PlaidConnectPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Card className="overflow-hidden">
        <div className="bg-primary/5 px-8 py-12">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Connect your accounts now to start identifying tax-loss harvesting
              opportunities and optimizing your investment strategy.
            </p>

            <PlaidConnectButton
              size="lg"
              variant="default"
              className="mx-auto w-full max-w-sm"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
