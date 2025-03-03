'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@repo/ui/components/form';
import { toast } from '@repo/ui/components/toast-sonner';
import {
  useQuery,
  useUpdateMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import InputField from '@repo/ui/form-builder/fields/input.field';
import { Button } from '@repo/ui/components/button';
import { useEffect } from 'react';

import { useEnvironment } from '~/app/main/environment.provider';
import postgrest from '~/lib/database/postgrest';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

const DatasetSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

interface PreviewPageProps {
  params: { datasetId: string; version: string };
}

export default function SettingsPage({
  params: { datasetId },
}: Readonly<PreviewPageProps>) {
  const { environment_schema } = useEnvironment();

  const { data, isLoading, error } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('dataset')
      .select(
        `
        *
        `
      )
      .eq('id', datasetId)
      .single()
  );

  const { mutate: updateDataset, isPending: isDatasetUpdating } =
    useUpdateMutation(postgrest.schema(schema).from('dataset'), ['id'], null, {
      onError: error => {
        console.error({ error });
        toast.error('Failed to update the dataset.');
      },
      onSuccess: () => {
        toast.success('Saved');
      },
    });

  const form = useForm<z.infer<typeof DatasetSchema>>({
    resolver: zodResolver(DatasetSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleSubmit = ({
    name,
    description,
  }: z.infer<typeof DatasetSchema>) => {
    updateDataset({
      id: datasetId,
      name,
      description,
      schema: schema,
    });
  };

  useEffect(() => {
    form.reset({
      name: data?.name ?? '',
      description: data?.description ?? '',
    });
  }, [form, data]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Manage the attributes of the dataset
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <InputField name="name" label="Name" autoFocus />
            <InputField
              name="description"
              label="Description"
              description="What does this data represent?"
            />
          </CardContent>
          <CardFooter>
            <Button
              disabled={isDatasetUpdating || !form.formState.isDirty}
              loading={isDatasetUpdating}
              type="submit"
            >
              Save
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
