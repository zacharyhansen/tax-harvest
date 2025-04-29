'use client';

import { Clock, Lock, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  RDialog,
  RDialogContent,
  RDialogTitle,
  RDialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui';
import PageWrapper from 'modules/page/page-wrapper';
import { LoadingPage } from 'modules/utilityComponents';

import {
  useAccountLiveUrlQuery,
  useInitiateConnectionMutation,
} from '~/generated/gql';

interface Provider {
  id: string;
  name: string;
}

const providers: Provider[] = [
  { id: 'etrade', name: 'E*TRADE' },
  { id: 'schwab', name: 'Charles Schwab' },
  { id: 'fidelity', name: 'Fidelity' },
  { id: 'robinhood', name: 'Robinhood' },
];

interface SetupAccountPageProps {
  params: { accountId: string };
}

export default function SetupAccountPage({
  params: { accountId },
}: SetupAccountPageProps) {
  const [selectedProvider, setSelectedProvider] = useState<
    string | undefined
  >();
  const [isConnecting, setIsConnecting] = useState(false);
  const [initiateConnection, { loading }] = useInitiateConnectionMutation();

  const handleConnect = () => {
    initiateConnection({
      variables: {
        accountId,
      },
    });
    if (selectedProvider) {
      setIsConnecting(true);
    }
  };

  return (
    <PageWrapper>
      <Card className="w-full shadow-lg">
        <CardHeader className="text-primary-foreground rounded-t-lg">
          <CardTitle className="text-2xl">Connect Your Account</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Choose a provider to securely connect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <SecurityFeature
                icon={<Shield className="h-8 w-8 text-green-500" />}
                title="Security Guarantee"
                description="We never store your credentials"
              />
              <SecurityFeature
                icon={<Lock className="h-8 w-8 text-blue-500" />}
                title="Secure Snapshot"
                description="We only take a snapshot of your portfolio"
              />
              <SecurityFeature
                icon={<Clock className="h-8 w-8 text-orange-500" />}
                title="Quick Connection"
                description="60-second connection window"
              />
            </div>
            <Select onValueChange={value => setSelectedProvider(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a provider..." />
              </SelectTrigger>
              <SelectContent>
                {providers.map(provider => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex items-center space-x-2">
                      {/* <ProviderLogo
                        provider={provider.id}
                        className="h-5 w-5"
                      /> */}
                      <span>{provider.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="rounded-b-lg bg-gray-50">
          <RDialog open={isConnecting} onOpenChange={setIsConnecting}>
            <RDialogTrigger asChild>
              <Button
                onClick={handleConnect}
                disabled={!selectedProvider || loading}
                loading={loading}
                className="w-full"
              >
                Connect Securely
              </Button>
            </RDialogTrigger>
            {/* !IMPORTANT - Dont render till its open since it has a polling effect */}
            {isConnecting ? (
              <ConnectionDialog
                accountId={accountId}
                setIsConnecting={setIsConnecting}
                selectedProvider={selectedProvider}
              />
            ) : null}
          </RDialog>
        </CardFooter>
      </Card>
    </PageWrapper>
  );
}

function ConnectionDialog({
  accountId,
  selectedProvider,
  setIsConnecting,
}: {
  selectedProvider?: string;
  accountId: string;
  setIsConnecting: (isConencting: boolean) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(180);
  const { data, error, loading, stopPolling } = useAccountLiveUrlQuery({
    // Poll every 1 second
    notifyOnNetworkStatusChange: true,
    pollInterval: 1000,
    variables: {
      accountId,
    },
  });

  // Start the time on mount
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevSeconds => prevSeconds - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Stop polling when liveURL is available
  useEffect(() => {
    if (data?.account.liveURL) {
      stopPolling();
    }
  }, [data, stopPolling]);

  // Close the modal / stop polling when we hit 0
  useEffect(() => {
    if (timeLeft === 0) {
      stopPolling();
      setIsConnecting(false);
    }
  }, [timeLeft, setIsConnecting, stopPolling]);

  return (
    <RDialogContent className="max-w-[90vw]">
      <div className="flex flex-col space-y-4">
        <RDialogTitle>Connect to {selectedProvider}</RDialogTitle>
        <div>
          <div className="flex h-[70vh] w-full items-center justify-center rounded-xl bg-black bg-opacity-50">
            {error ? (
              <Alert>There was an error creating the connection.</Alert>
            ) : loading || !data?.account.liveURL ? (
              <LoadingPage message="Creating secure conneciton..." />
            ) : (
              <iframe
                src={data.account.liveURL}
                className="h-full w-full rounded border-2 border-gray-200"
                title={`Connect to ${selectedProvider}`}
              />
            )}
          </div>
        </div>
        <div className="mt-auto flex items-center">
          <div className="text-sm text-gray-500">
            Time remaining: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <Button className="ml-auto" onClick={() => setIsConnecting(false)}>
            Close Connection
          </Button>
        </div>
      </div>
    </RDialogContent>
  );
}

function SecurityFeature({
  description,
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-gray-50 p-4 text-center">
      {icon}
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
