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
import type { TypedRoutes } from '~/lib/routes';
const SCHEMA = z.object({
  label: z.string(),
  description: z.string().optional(),
});

interface PreviewPageProps {
  params: typeof TypedRoutes.componentVersion.params;
}

export default function Page({
  params: { componentId },
}: Readonly<PreviewPageProps>) {
  const { environment_schema } = useEnvironment();

  const { data, isLoading, error } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('component')
      .select(
        `
        id,
        label,
        description,
        configuration_schema,
        updated_at
        `
      )
      .eq('id', componentId)
      .single()
  );

  const { mutate, isPending } = useUpdateMutation(
    postgrest.schema(environment_schema).from('component'),
    ['id'],
    null,
    {
      onError: error => {
        console.error({ error });
        toast.error('Failed to update the dataset.');
      },
      onSuccess: () => {
        toast.success('Saved');
      },
    }
  );

  const form = useForm<z.infer<typeof SCHEMA>>({
    resolver: zodResolver(SCHEMA),
    defaultValues: {
      label: '',
      description: '',
    },
  });

  const handleSubmit = ({ label, description }: z.infer<typeof SCHEMA>) => {
    mutate({
      id: componentId,
      label,
      description,
    });
  };

  useEffect(() => {
    form.reset({
      label: data?.label ?? '',
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
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Manage the attributes of the component
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <InputField name="label" label="Label" autoFocus />
            <InputField
              name="description"
              label="Description"
              description="What does this data represent?"
            />
          </CardContent>
          <CardFooter>
            <Button
              disabled={isPending || !form.formState.isDirty}
              loading={isPending}
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
