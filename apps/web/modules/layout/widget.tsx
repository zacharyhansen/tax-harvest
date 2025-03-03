'use client';

import { Button } from '@repo/ui/components/button';
import { Badge } from '@repo/ui/components/badge';
import FormDialog from '@repo/ui/components/form-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import ComboboxField from '@repo/ui/form-builder/fields/combobox.field';
import {
  useInsertMutation,
  useQuery,
} from '@supabase-cache-helpers/postgrest-react-query';
import { z } from 'zod';
import type { ReactNode } from 'react';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';

import Component from './component';

import postgrest from '~/lib/database/postgrest';
import { useEnvironment } from '~/app/main/environment.provider';
import type { TablesConfiguration } from '~/lib/database/helpers';
import { useUser } from '~/app/main/user.provider';

interface WidgetProps {
  widget: TablesConfiguration<'widget'> & {
    published_component_on_widget?: (TablesConfiguration<'published_component_on_widget'> & {
      published_component: TablesConfiguration<'published_component'> & {
        component_version: TablesConfiguration<'component_version'> & {
          table: TablesConfiguration<'table'>;
          form: TablesConfiguration<'form'>;
        };
      };
    })[];
  };
}

export default function Widget({ widget }: WidgetProps) {
  const { isConfiguring } = useUser();
  return (
    <div className="flex h-full flex-col space-y-2">
      {widget.published_component_on_widget?.map(component => {
        return (
          <Component
            key={`${widget.order}-${component.published_component_id}-${component.order}`}
            component={component}
            widget_id={widget.id}
          />
        );
      })}
      {isConfiguring ? (
        <AddComponentDialog
          key={`${widget.published_component_on_widget?.length ?? 0 + 1}-add-component`}
          order={widget.published_component_on_widget?.length ?? 0 + 1}
          widget_id={widget.id}
        >
          <Button variant="link" className="w-full">
            Add Component
          </Button>
        </AddComponentDialog>
      ) : null}
    </div>
  );
}

const SCHEMA = z.object({
  component_id: z.string(),
});

export const AddComponentDialog = ({
  children,
  widget_id,
  order,
}: {
  children: ReactNode;
  widget_id: string;
  order: number;
}) => {
  const { environment_schema, configuration_schema } = useEnvironment();

  const { data } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('published_component')
      .select(`id,component(label,description,type)`)
      .eq('environment_schema', environment_schema)
  );

  const { mutateAsync: insertComponent } = useInsertMutation(
    postgrest.schema(environment_schema).from('published_component_on_widget'),
    ['id'],
    'id',
    {
      revalidateTables: [
        {
          schema: environment_schema,
          table: 'layout',
        },
      ],
    }
  );

  const { form, handleSubmit } = useStandardForm<z.infer<typeof SCHEMA>>({
    resolver: zodResolver(SCHEMA),
    defaultValues: {
      component_id: '',
    },
    handleSubmit: async ({ component_id }) => {
      return insertComponent([
        {
          widget_id,
          published_component_id: component_id,
          configuration_schema,
          order,
        },
      ]);
    },
  });

  return (
    <FormDialog
      form={form}
      title="Add Component"
      description="Add a new component to the widget"
      handleSubmit={handleSubmit}
      trigger={children}
    >
      <ComboboxField
        name="component_id"
        label="Component"
        options={
          data?.map(component => ({
            richLabel: (
              <div className="flex flex-col overflow-auto text-wrap">
                <div className="flex items-center gap-2 font-semibold">
                  {component.component?.label}{' '}
                  <Badge variant="secondary">{component.component?.type}</Badge>
                </div>
                <span className="text-sm">
                  {component.component?.description}
                </span>
              </div>
            ),
            label: component.component?.label ?? '',
            value: component.id!,
            keywords: [
              component.component?.label ?? '',
              component.component?.type ?? '',
            ],
          })) ?? []
        }
      />
    </FormDialog>
  );
};
