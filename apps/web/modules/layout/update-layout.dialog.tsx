'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@repo/ui/components/toast-sonner';
import InputField from '@repo/ui/form-builder/fields/input.field';
import {
  useInsertMutation,
  useUpdateMutation,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
import { useEffect, type ReactNode } from 'react';
import { z } from 'zod';
import FormDialog from '@repo/ui/components/form-dialog';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';

import { useEnvironment } from '~/app/main/environment.provider';
import type { TablesConfiguration } from '~/lib/database/helpers';
import postgrest from '~/lib/database/postgrest';
import type { LayoutSlug } from '~/lib/constants/layout.slugs';
import { useUser } from '~/app/main/user.provider';
const LayoutSchema = z.object({
  label: z.string().nullable(),
  description: z.string().nullable(),
});

interface UpsertLayoutProps {
  existingLayout?: TablesConfiguration<'layout'>;
  children: ReactNode;
  slug?: LayoutSlug;
  onSuccess: VoidFunction;
}

export default function UpsertLayout({
  existingLayout,
  children,
  slug,
  onSuccess,
}: Readonly<UpsertLayoutProps>) {
  const { user } = useUser();
  const { environment_schema } = useEnvironment();

  const { mutateAsync: updateLayout } = useUpdateMutation(
    postgrest.schema(environment_schema).from('layout'),
    ['id'],
    '*',
    {
      onSuccess: () => {
        form.reset(values => values);
        toast.success('Saved');
        onSuccess();
      },
      onError: () => {
        toast.error('Unable to create layout.');
      },
    }
  );

  const { form, handleSubmit } = useStandardForm<z.infer<typeof LayoutSchema>>({
    resolver: zodResolver(LayoutSchema),
    defaultValues: {
      label: '',
      description: '',
    },
    handleSubmit: async ({ label, description }) => {
      if (existingLayout) {
        return updateLayout({
          id: existingLayout.id,
          label,
          description,
        });
      } else {
        return postgrest
          .schema(environment_schema)
          .rpc('component_create', {
            p_type: 'layout',
            p_label: label ?? '',
            p_description: description ?? '',
            p_user_id: user.user_id,
            p_role_view_name: '',
            p_role_name: user.role_name,
            p_slug: slug,
          })
          .single()
          .then(result => {
            if (!result.error) {
              onSuccess();
              return toast.success('Layout created');
            } else {
              toast.error('Unable to create layout');
              throw new Error('Failed to create layout');
            }
          });
      }
    },
  });

  useEffect(() => {
    form.reset({
      label: existingLayout?.label ?? '',
      description: existingLayout?.description ?? '',
    });
  }, [form, existingLayout]);

  return (
    <FormDialog
      form={form}
      title={existingLayout ? 'Update' : 'Create'}
      handleSubmit={handleSubmit}
      trigger={children}
    >
      <InputField label="Title" name="label" />
      <InputField label="Description" name="description" />
    </FormDialog>
  );
}
