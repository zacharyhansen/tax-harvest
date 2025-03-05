import { FormProvider } from 'react-hook-form';
import {
  Alert,
  Button,
  FormInput,
  RDialogContent,
  RDialogTitle,
  Skeleton,
  toast,
  useReactHookForm,
} from '@repo/ui/components/button';
import { z } from 'zod';
import {
  useOauthEtradeMutation,
  useVerificationEtradeQuery,
} from 'generated/gql';

import { usePortfolio } from '../portfolio/providers/PortfolioProvider';

const verifificationFormSchema = z.object({
  verifier: z.string().length(5),
});

interface CreateAuthConnectionDialogProps {
  open: boolean;
  closeDialog: VoidFunction;
}

export default function CreateAuthConnectionDialog({
  closeDialog,
  open,
}: CreateAuthConnectionDialogProps) {
  const { portfolio } = usePortfolio();
  const {
    data: verification,
    error: verificationError,
    loading: loadingVerification,
  } = useVerificationEtradeQuery({
    skip: !open,
    variables: {
      portfolioId: portfolio.id,
    },
  });

  const [oauthEtrade] = useOauthEtradeMutation();

  const [verificationForm, onSumbitVerification] = useReactHookForm<
    z.infer<typeof verifificationFormSchema>
  >({
    formProps: {
      defaultValues: {},
    },
    formSchema: verifificationFormSchema,
    handleSubmit: ({ verifier }: z.infer<typeof verifificationFormSchema>) => {
      closeDialog();
      toast.promise(
        oauthEtrade({
          refetchQueries: 'active',
          variables: {
            portfolioId: portfolio.id,
            verifier,
          },
        }),
        {
          error: 'We were unable to connect to your account',
          loading: 'Connecting',
          success: 'Successfully connected your etrade account',
        }
      );
    },
  });

  return (
    <RDialogContent>
      <RDialogTitle>Etrade</RDialogTitle>
      {verificationError ? (
        <Alert>There was an retrievig the verification url</Alert>
      ) : loadingVerification ||
        !verification?.requestOauthConnection.verificationUrl ? (
        <div className="space-y-2">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
      ) : (
        <>
          <a
            href={verification?.requestOauthConnection.verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link text-center"
          >
            Click here to get your code and submit it below to connect your
            account.
          </a>
          <FormProvider {...verificationForm}>
            <form onSubmit={onSumbitVerification}>
              <div>
                <div className="space-y-4 py-2 pb-4">
                  <div className="space-y-2">
                    <FormInput name="verifier" label="Verification Code" />
                  </div>
                </div>
              </div>
              <Button className="w-full" type="submit">
                Connect
              </Button>
            </form>
          </FormProvider>
        </>
      )}
    </RDialogContent>
  );
}
