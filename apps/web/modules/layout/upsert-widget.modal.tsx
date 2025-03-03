'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import FormDialog from '@repo/ui/components/form-dialog';
import { toast } from '@repo/ui/components/toast-sonner';
import InputField from '@repo/ui/form-builder/fields/input.field';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import { useUpsertMutation } from '@supabase-cache-helpers/postgrest-react-query';
import type { ReactNode } from 'react';
import { z } from 'zod';

import { useEnvironment } from '~/app/main/environment.provider';
import type { TablesConfiguration } from '~/lib/database/helpers';
import postgrest from '~/lib/database/postgrest';

const WidgetSchema = z.object({
  label: z.string().min(1),
  description: z.string().nullable(),
});

interface UpsertWidgetProps {
  existingWidget?: TablesConfiguration<'widget'>;
  tile: TablesConfiguration<'tile'> & {
    widget: TablesConfiguration<'widget'>[];
  };
  onSuccess?: VoidFunction;
  children: ReactNode;
}

export default function UpsertWidget({
  existingWidget,
  onSuccess,
  children,
  tile,
}: Readonly<UpsertWidgetProps>) {
  const { environment_schema, configuration_schema } = useEnvironment();

  const { mutate: upsertWidget } = useUpsertMutation(
    postgrest.schema(environment_schema).from('widget'),
    ['id'],
    '*',
    {
      onSuccess: () => {
        onSuccess?.();
        toast.success('Created widget');
      },
      onError: () => {
        toast.error('Unable to create widget.');
      },
      revalidateTables: [
        {
          schema: environment_schema,
          table: 'layout',
        },
      ],
    }
  );

  const { form, handleSubmit } = useStandardForm<z.infer<typeof WidgetSchema>>({
    resolver: zodResolver(WidgetSchema),
    defaultValues: {
      label: existingWidget?.label ?? '',
      description: existingWidget?.description ?? '',
    },
    handleSubmit: ({ label, description }: z.infer<typeof WidgetSchema>) => {
      return upsertWidget([
        {
          ...existingWidget,
          order: tile.widget.at(-1)?.order ?? 0 + 1,
          label,
          configuration_schema,
          description,
          tile_id: tile.id,
        },
      ]);
    },
  });

  return (
    <FormDialog
      form={form}
      title={existingWidget ? 'Update' : 'Create'}
      description={existingWidget ? 'Update the widget' : 'Create a new widget'}
      handleSubmit={handleSubmit}
      trigger={children}
    >
      <InputField label="Title" name="label" />
      <InputField label="Description" name="description" />
    </FormDialog>
  );
}
