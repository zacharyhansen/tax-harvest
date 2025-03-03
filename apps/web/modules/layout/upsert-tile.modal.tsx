'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import FormDialog from '@repo/ui/components/form-dialog';
import { toast } from '@repo/ui/components/toast-sonner';
import InputField from '@repo/ui/form-builder/fields/input.field';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import {
  useInsertMutation,
  useUpdateMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
import { useEffect, type ReactNode } from 'react';
import { z } from 'zod';

import { useEnvironment } from '~/app/main/environment.provider';
import type { TablesConfiguration } from '~/lib/database/helpers';
import postgrest from '~/lib/database/postgrest';

const TileSchema = z.object({
  label: z.string(),
  description: z.string().optional(),
});

interface UpsertTileProps {
  existingTile?: TablesConfiguration<'tile'>;
  children: ReactNode;
  layout: TablesConfiguration<'layout'> & {
    tile: TablesConfiguration<'tile'>[];
  };
}

export default function UpsertTile({
  existingTile,
  children,
  layout,
}: Readonly<UpsertTileProps>) {
  const { environment_schema, configuration_schema } = useEnvironment();
  const { mutateAsync: updateTile } = useUpdateMutation(
    postgrest.schema(environment_schema).from('tile'),
    ['id'],
    '*',
    {
      onSuccess: () => {
        toast.success('Tile updated');
        form.reset();
      },
      onError: () => {
        toast.error('Error');
      },
      revalidateTables: [{ schema: environment_schema, table: 'layout' }],
    }
  );

  const { mutateAsync: insertTile } = useInsertMutation(
    postgrest.schema(environment_schema).from('tile'),
    ['id'],
    '*',
    {
      onError: () => {
        toast.error('Error');
      },
    }
  );

  const { mutateAsync: insertWidget } = useInsertMutation(
    postgrest.schema(environment_schema).from('widget'),
    ['id'],
    '*',
    {
      onSuccess: () => {
        toast.success('Tile created');
        form.reset();
      },
      revalidateTables: [{ schema: environment_schema, table: 'layout' }],
    }
  );

  const { form, handleSubmit } = useStandardForm({
    handleSubmit: ({ label, description }) => {
      if (existingTile) {
        return updateTile({
          id: existingTile.id,
          configuration_schema,
          updated_at: new Date().toISOString(),
          label,
          description,
        });
      } else {
        return insertTile([
          {
            layout_id: layout.id,
            configuration_schema,
            order: layout.tile.length + 1,
            label,
            description,
          },
        ]).then(res => {
          return insertWidget([
            {
              tile_id: res?.[0]?.id,
              configuration_schema,
              label,
            },
          ]);
        });
      }
    },
    resolver: zodResolver(TileSchema),
    defaultValues: {
      label: existingTile?.label ?? '',
      description: existingTile?.description ?? '',
    },
  });

  useEffect(() => {
    form.reset({
      description: existingTile?.description ?? '',
      label: existingTile?.label ?? '',
    });
  }, [existingTile?.description, existingTile?.label, form]);

  return (
    <FormDialog
      form={form}
      title={existingTile ? 'Update Tile' : 'Create Tile'}
      handleSubmit={handleSubmit}
      trigger={children}
    >
      <InputField label="Title" name="label" />
      <InputField label="Description" name="description" />
    </FormDialog>
  );
}
