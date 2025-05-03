import type { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import FormDialog from '@repo/ui/components/form-dialog';
import InputField from '@repo/ui/form-builder/fields/input.field';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import { z } from 'zod';

// import {
//   AccountInstitution,
//   AccountsDocument,
//   AuthSource,
//   AuthType,
//   useCreateAccountForPortfolioMutation,
// } from "generated/gql";
// import { useCurrentUser } from "modules/user";

// import { usePortfolio } from "../portfolio/providers/PortfolioProvider";

type CreateAccountDialogProps = {
  children: ReactNode;
};

const formSchema = z.object({
  name: z.string().min(1),
  type: z.string(),
});

export default function CreateAccountDialog({
  children,
}: CreateAccountDialogProps) {
  // const [open, setOpen] = useState(false);
  // const { portfolio } = usePortfolio();
  // const user = useCurrentUser();
  // const [createAccount] = useCreateAccountForPortfolioMutation();

  const { form, handleSubmit } = useStandardForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: 'New Account',
    },
    resolver: zodResolver(formSchema),
    handleSubmit: (_data) => {
      // toast.promise(
      //   createAccount({
      //     refetchQueries: [AccountsDocument],
      //     variables: {
      //       accountCreateInput: {
      //         ...values,
      //         authConnection: {
      //           create: {
      //             portfolio: {
      //               connect: {
      //                 id: portfolio.id,
      //               },
      //             },
      //             source: AuthSource.Local,
      //             type: AuthType.Oauth_1,
      //             user: {
      //               connect: {
      //                 id: user!.id,
      //               },
      //             },
      //           },
      //         },
      //         institution: AccountInstitution.Brokerage,
      //         portfolio: { connect: { id: portfolio.id } },
      //         type: values.type || "Individual",
      //       },
      //     },
      //   }),
      //   {
      //     error: "Error",
      //     loading: "Loading...",
      //     success: "Account created",
      //   }
      // );
    },
  });
  return (
    <FormDialog
      form={form}
      title="Create Account"
      description="Connect an account to this portfolio"
      handleSubmit={handleSubmit}
      trigger={children}
    >
      <InputField name="name" label="Account Name" placeholder="My Account" />
      <InputField
        name="type"
        label="Account Type"
        placeholder="My Account Type"
      />
    </FormDialog>
  );
}
