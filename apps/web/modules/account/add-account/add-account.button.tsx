import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@repo/ui/components/button'
import { Input } from '@repo/ui/components/input'
import { Label } from '@repo/ui/components/label'
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@repo/ui/components/reponsive-dialog'
import { defineStepper } from '@repo/ui/components/stepper'
import { toast } from '@repo/ui/components/toast-sonner'
import InputField from '@repo/ui/form-builder/fields/input.field'
import { useStandardForm } from '@repo/ui/hooks/use-standard-form'

import { DollarSign, Plus } from 'lucide-react'
import { FormProvider } from 'react-hook-form'
import { z } from 'zod'

import {
  useAccountQuery,
  useUpdateAccountMutation,
  useUpdateAccountRealizedPAndLMutation,
} from '~/generated/gql'
import { EtradeCSVUpload } from '~/modules/fileUpload'
import { zodNumber } from '~/modules/utils/zod-utils'
import { AnalyzeStep } from './analyze.step'
import { CompleteStep } from './complete.step'
import { OngoingStep } from './ongoing.step'

const accountId = '123'

const { Scoped, useStepper, steps } = defineStepper(
  { id: 'upload', title: 'Upload Portfolio', description: 'Upload your portfolio CSV file to automatically capture your tax lots' },
  { id: 'analyze', title: 'Analyzing Account', description: 'Building the most optimal strategies for your account based on its current tax lots' },
  { id: 'complete', title: 'Complete', description: 'Your account is ready to go!' },
  { id: 'ongoing', title: 'Ongoing Harvests', description: 'Dont miss a single opportunity to Tax Harvest. We use Plaid to securely connect to your brokerage and constantly identify opportunities for you to Tax Harvest' },
)

const accountFormSchema = z.object({
  deferredLoss: zodNumber,
  description: z.string().nullable().optional(),
  dividend: zodNumber,
  longTerm: zodNumber,
  shortTerm: zodNumber,
  accountName: z.string(),
})

export function AddAccountButton() {
  const stepper = useStepper()

  const [update, { loading }] = useUpdateAccountMutation({
    onError: () => {
      toast.error('Unable to update account.')
    },
  })

  const [updateRealizedPAndL, { loading: loadingUpdateRealizedPAndL }]
    = useUpdateAccountRealizedPAndLMutation({
      onError: () => {
        toast.error('Unable to update account.')
      },
    })

  const { form, handleSubmit } = useStandardForm<
    z.infer<typeof accountFormSchema>
  >({
    defaultValues: {
      deferredLoss: 0,
      description: '',
      dividend: 0,
      longTerm: 0,
      shortTerm: 0,
      accountName: 'My First Account',
    },
    resolver: zodResolver(accountFormSchema),
    handleSubmit: ({
      deferredLoss,
      description,
      dividend,
      longTerm,
      shortTerm,
    }) => {
      return toast.promise(
        Promise.all([
          update({
            variables: {
              accountUpdateInput: {
                description: {
                  set: description,
                },
              },
              accountWhereUniqueInput: {
                id: accountId,
              },
            },
          }),
          updateRealizedPAndL({
            variables: {
              id: accountId,
              input: {
                deferredLoss: {
                  set: deferredLoss.toString(),
                },
                dividend: {
                  set: dividend.toString(),
                },
                longTerm: {
                  set: longTerm.toString(),
                },
                shortTerm: {
                  set: shortTerm.toString(),
                },
              },
            },
          }),
        ]).then(([updateAccount, updateRealizedPAndL]) => {
          form.reset({
            deferredLoss: Number(
              updateRealizedPAndL.data?.updateRealizedPAndL.deferredLoss,
            ),
            description: updateAccount.data?.updateAccount.description,
            dividend: Number(
              updateRealizedPAndL.data?.updateRealizedPAndL.dividend,
            ),
            longTerm: Number(
              updateRealizedPAndL.data?.updateRealizedPAndL.longTerm,
            ),
            shortTerm: Number(
              updateRealizedPAndL.data?.updateRealizedPAndL.shortTerm,
            ),
          })
        }),
        {
          error: 'Error',
          loading: 'Saving',
          success: 'Saved',
        },
      )
    },
  })

  return (

    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button>
          <Plus className="mr-2 size-4" />
          Add Account
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="md:max-w-4xl" overlayClassName="bg-background">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {stepper.switch({
              upload: step => <div>{step.title}</div>,
              analyze: step => <div>{step.title}</div>,
              complete: step => <div>{step.title}</div>,
              ongoing: step => <div>{step.title}</div>,
            })}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {stepper.switch({
              upload: step => <div>{step.description}</div>,
              analyze: step => <div>{step.description}</div>,
              complete: step => <div>{step.description}</div>,
              ongoing: step => <div>{step.description}</div>,
            })}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogBody>
          {stepper.when('upload', _step => (
            <FormProvider {...form}>
              <div className=" p-8 ">
                {/* Upload Section */}
                <div className="mb-6">
                  <h2 className="mb-3 text-lg font-semibold">Upload Portfolio CSV</h2>

                  <EtradeCSVUpload accountId="123" />
                </div>

                <InputField
                  name="accountName"
                  label="Account Name"
                  type="text"
                  className="w-full"
                />
                {/* Tax Information Grid */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <InputField
                      startIcon={DollarSign}
                      name="shortTerm"
                      label="Short Term Realized P & L"
                      type="number"
                      description="Find yours by navigating to your Etrade Settings"
                    />
                  </div>
                  <div>
                    <InputField
                      startIcon={DollarSign}
                      name="longTerm"
                      label="Long Term Realized P & L"
                      type="number"
                      description="Find yours by navigating to your Etrade Settings"
                    />
                  </div>
                  <div>
                    <InputField
                      startIcon={DollarSign}
                      name="dividend"
                      label="Dividend"
                      type="number"
                      description="Find yours by navigating to your Etrade Settings"
                    />
                  </div>
                  <div>
                    <InputField
                      startIcon={DollarSign}
                      name="deferredLoss"
                      label="Deferred Loss"
                      type="number"
                      description="Find yours by navigating to your Etrade Settings"
                    />
                  </div>
                </div>

                {/* Net Account Status */}
                <div className="mb-6">
                  <Label className="mb-2 block text-sm text-gray-400">Net Account Status</Label>
                  <div className="text-xl font-bold text-white">$12,542</div>
                </div>
              </div>
            </FormProvider>
          ))}
          {stepper.when('analyze', _step => (
            <AnalyzeStep />
          ))}
          {stepper.when('complete', _step => (
            <CompleteStep />
          ))}
          {stepper.when('ongoing', _step => (
            <OngoingStep />
          ))}
        </ResponsiveDialogBody>
        <ResponsiveDialogFooter>
          {stepper.switch({
            upload: step => (
              <>
                <ResponsiveDialogClose>
                  <Button variant="outline">Close</Button>
                </ResponsiveDialogClose>
                <Button onClick={stepper.next}>Next</Button>
              </>
            ),
            analyze: step => (
              <>
                <Button onClick={stepper.next}>Next</Button>
              </>
            ),
            complete: step => (
              <>
                <Button variant="outline" onClick={stepper.prev}>Back</Button>
                <Button onClick={stepper.next}>Next</Button>
              </>
            ),
            ongoing: step => (
              <>
                <Button variant="outline" onClick={stepper.prev}>Back</Button>
                <ResponsiveDialogClose>
                  <Button variant="outline" onClick={stepper.reset}>Skip for now</Button>
                </ResponsiveDialogClose>
              </>
            ),
          })}

        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
