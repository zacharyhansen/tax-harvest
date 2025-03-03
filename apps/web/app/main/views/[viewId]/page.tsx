'use client';

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { Editor } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@repo/ui/components/tabs';

import { trpc } from '~/lib/trpc';
import postgrest from '~/lib/database/postgrest';
import { LoadingPage } from '~/modules/utility-components';
import { LayoutWrapper } from '~/modules/layout';
import { formatSQL } from '~/modules/utils/sql';
import { useEnvironment } from '~/app/main/environment.provider';
interface ViewPageProps {
  params: { viewId: string };
}

export default function ViewPage({ params }: Readonly<ViewPageProps>) {
  const { environment_schema } = useEnvironment();
  const { data, error, isLoading } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('view')
      .select(
        `
          name
        `
      )
      .eq('id', params.viewId)
      .limit(1)
  );

  if (isLoading || error || !data?.[0]?.name) {
    return <LoadingPage message="Fetching view" />;
  }

  return <View id={params.viewId} name={data[0]?.name} />;
}

const View = ({ id, name }: { id: string; name: string }) => {
  const { data, isLoading } = trpc.view.viewDefinition.useQuery({
    id,
    name,
  });
  const { theme } = useTheme();

  if (isLoading) {
    return <LoadingPage message="Fetching view" />;
  }

  return (
    <LayoutWrapper
      title={name}
      description="Manage the view definiton of this entity."
    >
      <Tabs defaultValue="definition" className="" orientation="vertical">
        <TabsList>
          <TabsTrigger value="definition">Definition</TabsTrigger>
          <TabsTrigger value="columns">Columns</TabsTrigger>
        </TabsList>
        <TabsContent value="definition" className="flex flex-col" asChild>
          <div className="h-[700px] rounded-lg">
            <Editor
              language="sql"
              onMount={editor => {
                const formatValue = () => {
                  const current = editor.getValue();
                  editor.setValue(formatSQL(current));
                };

                formatValue();
                editor.onDidBlurEditorWidget(formatValue);
              }}
              defaultValue={data?.view_definition ?? ''}
              className="h-full w-full"
              theme={theme === 'light' ? 'light' : 'vs-dark'}
            />
          </div>
        </TabsContent>
        <TabsContent value="columns">Change your password here.</TabsContent>
      </Tabs>
    </LayoutWrapper>
  );
};
