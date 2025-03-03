'use client';

import { FormComponent, TableComponent } from '../dataset';

import type { TablesConfiguration } from '~/lib/database/helpers';

interface ComponentProps {
  component: TablesConfiguration<'published_component_on_widget'> & {
    published_component: TablesConfiguration<'published_component'> & {
      component_version: TablesConfiguration<'component_version'> & {
        table: TablesConfiguration<'table'>;
        form: TablesConfiguration<'form'>;
      };
    };
  };
  widget_id: string;
}

export default function Component({ component }: ComponentProps) {
  return (
    <div className="flex h-full min-h-60 flex-col">
      {component.published_component.component_version.type === 'table' ? (
        <TableComponent
          datasetId={
            component.published_component.component_version.table.dataset_id
          }
        />
      ) : component.published_component.component_version.type === 'form' ? (
        <FormComponent
          datasetId={
            component.published_component.component_version.form.dataset_id
          }
        />
      ) : null}
    </div>
  );
}
