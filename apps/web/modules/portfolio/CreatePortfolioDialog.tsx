'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { z } from 'zod';

import { usePortfolio } from './providers/PortfolioProvider';

import { useUser } from '~/app/main/user.provider';

interface CreatePortfolioDialogProps {
  children: ReactNode;
}

export default function CreatePortfolioDialog({
  children,
}: CreatePortfolioDialogProps) {
  // const [createUserPortfolio] = useCreatePortfolioMutation();

  // const [form, onSumbit] = useReactHookForm<z.infer<typeof formSchema>>({
  //   formProps: {
  //     defaultValues: {
  //       name: '',
  //     },
  //   },
  //   formSchema,
  //   handleSubmit: values => {
  //     setOpen(false);
  //     toast.promise(
  //       createUserPortfolio({
  //         onCompleted: reload,
  //         variables: {
  //           portfolioInsertObject: {
  //             ...values,
  //             createdBy: {
  //               connect: {
  //                 id: user.id,
  //               },
  //             },
  //           },
  //         },
  //       }),
  //       {
  //         error: 'Error',
  //         loading: 'Loading...',
  //         success: 'Create Portfolio',
  //       }
  //     );
  //   },
  // });
  return <div>Create Portfolio Dialog</div>;
  // return (
  //   <Dialog open={open} onOpenChange={setOpen}>
  //     <DialogTrigger asChild>{children}</DialogTrigger>
  //     <DialogContent>
  //       <DialogHeader>
  //         <DialogTitle>Create Portfolio</DialogTitle>
  //         <DialogDescription>
  //           Add a portfolio to manage connected accounts for a unique tax filing
  //         </DialogDescription>
  //       </DialogHeader>
  //       <FormProvider {...form}>
  //         <form onSubmit={onSumbit}>
  //           <div>
  //             <div className="space-y-4 py-2 pb-4">
  //               <div className="space-y-2">
  //                 <FormInput name="name" label="Portfolio Name" />
  //               </div>
  //             </div>
  //           </div>
  //           <DialogFooter>
  //             <Button type="submit">Create</Button>
  //           </DialogFooter>
  //         </form>
  //       </FormProvider>
  //     </DialogContent>
  //   </Dialog>
}
