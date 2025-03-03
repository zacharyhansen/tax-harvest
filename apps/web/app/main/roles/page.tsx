'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/toast-sonner';
import {
  useInsertMutation,
  useQuery,
} from '@supabase-cache-helpers/postgrest-react-query';
import { type ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogBody,
  ResponsiveDialogFooter,
} from '@repo/ui/components/reponsive-dialog';
import InputField from '@repo/ui/form-builder/fields/input.field';
import { Form } from '@repo/ui/components/form';

import postgrest from '~/lib/database/postgrest';
import { AgGridWrapper, dataTypeDefinitions } from '~/modules/client-ag-grid';
import { LayoutWrapper } from '~/modules/layout';
import { ErrorPage } from '~/modules/utility-components';

const roleSchema = z.object({
  name: z.string(),
});

export default function Roles() {
  const { data, isLoading, error } = useQuery(
    postgrest
      .schema('foundation')
      .from('role')
      .select(
        `
        *
        `
      )
      .order('name', { ascending: false })
  );
  type TData = NonNullable<typeof data>[number];

  const columnDefs: ColDef<TData>[] = useMemo(
    () => [
      {
        field: 'name',
      },
    ],
    []
  );

  const { mutate: insertRole, isPending: isRoleInserting } = useInsertMutation(
    postgrest.schema('foundation').from('role'),
    ['name'],
    null,
    {
      onError: error => {
        console.error({ error });
        toast.error('Failed to create the role.');
      },
      onSuccess: () => {
        form.reset();
      },
    }
  );

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleSubmit = ({ name }: z.infer<typeof roleSchema>) => {
    insertRole([
      {
        name: name,
        schema: 'foundation',
      },
    ]);
  };

  if (error) {
    console.error({ error });
    return <ErrorPage message="There was an error loading your roles." />;
  }

  return (
    <LayoutWrapper>
      <AgGridWrapper
        title="Roles"
        error={error}
        loading={isRoleInserting}
        rightBar={
          <ResponsiveDialog>
            <ResponsiveDialogTrigger asChild>
              <Button>Create Role</Button>
            </ResponsiveDialogTrigger>
            <ResponsiveDialogContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>New Role</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                      Role names must be unique and cannot be changed once
                      created in the system.
                    </ResponsiveDialogDescription>
                  </ResponsiveDialogHeader>
                  <ResponsiveDialogBody className="">
                    <InputField name="name" label="Name" autoFocus />
                  </ResponsiveDialogBody>
                  <ResponsiveDialogFooter>
                    <ResponsiveDialogClose asChild>
                      <Button variant="secondary">Close</Button>
                    </ResponsiveDialogClose>
                    <ResponsiveDialogClose asChild>
                      <Button
                        disabled={isRoleInserting}
                        loading={isRoleInserting}
                        type="submit"
                      >
                        Create
                      </Button>
                    </ResponsiveDialogClose>
                  </ResponsiveDialogFooter>
                </form>
              </Form>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        }
      >
        <AgGridReact<TData>
          dataTypeDefinitions={dataTypeDefinitions}
          rowData={data}
          loading={isLoading}
          columnDefs={columnDefs}
          rowDragManaged
        />
      </AgGridWrapper>
    </LayoutWrapper>
  );
}
