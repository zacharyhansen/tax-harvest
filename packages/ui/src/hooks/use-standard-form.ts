import { useForm, type FieldValues, type UseFormProps } from 'react-hook-form';

export function useStandardForm<
  TFieldValues extends FieldValues = FieldValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
>({
  handleSubmit,
  ...useFormProps
}: {
  handleSubmit: (params: TFieldValues) => void;
} & UseFormProps<TFieldValues, TContext>) {
  const form = useForm<TFieldValues, TContext>({
    ...useFormProps,
  });

  return { form, handleSubmit: form.handleSubmit(handleSubmit) };
}
