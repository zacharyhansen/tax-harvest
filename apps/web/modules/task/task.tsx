'use client';

import { Avatar, AvatarFallback } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { CommandBox } from '@repo/ui/components/commandbox';
import { Input } from '@repo/ui/components/input';
import { Separator } from '@repo/ui/components/separator';
import { Textarea } from '@repo/ui/components/textarea';
import { toast } from '@repo/ui/components/toast-sonner';
import {
  useInsertMutation,
  useQuery,
  useUpdateMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
import { PaperclipIcon, ArrowUpIcon, Dot } from 'lucide-react';
import { useRef } from 'react';
import { ComboboxAsync } from '@repo/ui/components/comboboxAsync';
import { stringToTailwindColor } from '@repo/ui/utils';
import { useDebounceCallback } from 'usehooks-ts';
import { AvatarGroup } from '@repo/ui/components/avatar-group';
import { TiptapBase } from '@repo/ui/tiptap/molecules/tiptap-base';

import { statusIdToIcon } from '../client-ag-grid/cells/task-status.cell';
import { LoadingPage } from '../utility-components';
import { taskIdToIcon } from '../client-ag-grid/cells/task-priority.cell';
import { UserOption } from '../option/user.option';
import { DealOption } from '../option/deal.option';

import { useEnvironment } from '~/app/main/environment.provider';
import postgrest from '~/lib/database/postgrest';
import { PageWrapperWithNav } from '~/modules/layout';
import type { TaskMetaData } from '~/modules/task/activity-item';
import ActivityItem from '~/modules/task/activity-item';
import { useUser } from '~/app/main/user.provider';
interface TaskProps {
  taskId: string;
}

export default function Task({ taskId }: TaskProps) {
  const { environment_schema } = useEnvironment();
  const { user } = useUser();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const { data: task, isLoading: taskLoading } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('task')
      .select(
        `*,
        deal(id, label, opportunity!opportunity_active_deal_id_fkey(id, label)),
        assignee:user!task_assignee_id_fkey(
          user_id,
          name,
          email
        ),
        creator:user!task_created_by_id_fkey(
          user_id,
          name,
          email
        ),
        subscribers:user!task_subscriber(
          user_id,
          name,
          email
        )
        `
      )
      .eq('id', taskId)
      .single()
  );

  const { data: taskEvents } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('task_event')
      .select(
        `*,
        user(
          user_id,
          name,
          email
        )`
      )
      .eq('task_id', taskId)
      .order('id', { ascending: true })
  );

  const { data: taskStatuses, isLoading: taskStatusesLoading } = useQuery(
    postgrest.schema(environment_schema).from('task_status').select('*')
  );

  const { data: taskPriorities, isLoading: taskPrioritiesLoading } = useQuery(
    postgrest.schema(environment_schema).from('task_priority').select('*')
  );

  const addComment = useInsertMutation(
    postgrest.schema(environment_schema).from('task_event'),
    ['id'],
    'id',
    {
      onError: () => {
        toast.error('Failed to add comment');
      },
    }
  );

  const mutate = useUpdateMutation(
    postgrest.schema(environment_schema).from('task'),
    ['id'],
    'id',
    {
      onError: () => {
        toast.error('Failed to update task');
      },
    }
  );

  const debouncedSave = useDebounceCallback((value: string, field: string) => {
    return mutate.mutateAsync({
      id: taskId,
      [field]: value,
    });
  }, 300);

  if (taskStatusesLoading || taskPrioritiesLoading || taskLoading) {
    return <LoadingPage />;
  }

  return (
    <PageWrapperWithNav>
      {/* PAGE CONTENT */}
      <div className="bg-background mx-auto flex max-w-4xl flex-col rounded-lg p-6 shadow-sm">
        {/* Task Title */}
        <Input
          variant="ghost"
          className="mb-2 text-2xl font-semibold"
          defaultValue={task?.title ?? ''}
          onChange={e => {
            return debouncedSave(e.target.value, 'title');
          }}
        />
        {/* Description */}
        <TiptapBase
          placeholder="Add description..."
          value={task?.description ?? ''}
          editable={true}
          throttleDelay={1000}
          variant="default"
          output="html"
          className=""
          onChange={e => {
            return debouncedSave(e?.toString() ?? '', 'description');
          }}
        />

        {/* Action Buttons */}
        <div className="my-2 flex items-center">
          <div className="flex-grow" />
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <PaperclipIcon className="h-5 w-5" />
          </Button>
        </div>

        <Separator className="mb-2" />

        {/* Activity Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-medium">Activity</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="transition-colors">
              Subscribed
            </Button>
            <AvatarGroup
              people={
                task?.subscribers.map(subscriber => ({
                  id: subscriber.user_id,
                  email: subscriber.email,
                  name: subscriber.name,
                  // photo: subscriber.photo,
                })) ?? []
              }
            />
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-4 text-sm">
          {taskEvents?.map(event => (
            <>
              <ActivityItem
                key={event.id}
                avatar={
                  <Avatar className="h-7 w-7 text-xs">
                    <AvatarFallback
                      className={stringToTailwindColor(event.user.user_id)}
                    >
                      {event.user.name?.split(' ').map(name => name[0])}
                    </AvatarFallback>
                  </Avatar>
                }
                name={event.user.name ?? event.user.email}
                metaData={event.metadata as unknown as TaskMetaData}
                time={event.timestamp}
                comment={event.comment}
              />
            </>
          ))}
        </div>

        {/* Comment Input */}
        <div className="relative mt-4">
          <Textarea
            ref={commentRef}
            placeholder="Leave a comment..."
            className="bg-input-foreground min-h-[100px] resize-none rounded-lg border pr-16"
          />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <Button
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => {
                if (commentRef.current?.value) {
                  void addComment
                    .mutateAsync([
                      {
                        task_id: taskId,
                        created_by: user.user_id,
                        comment: commentRef.current.value,
                      },
                    ])
                    .then(() => {
                      if (commentRef.current) {
                        commentRef.current.value = '';
                      }
                    });
                }
              }}
            >
              <ArrowUpIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* NAV */}
      <div className="flex w-72 flex-col gap-4 px-4">
        <CommandBox
          label="Status"
          commandOptions={
            taskStatuses?.map(status => ({
              icon: statusIdToIcon[status.id] ?? Dot,
              label: status.label,
              value: status.id.toString(),
            })) ?? []
          }
          commandKey="S"
          onChange={statusId => {
            toast.promise(
              mutate.mutateAsync({
                id: taskId,
                status_id: statusId ? Number(statusId) : undefined,
              }),
              {
                error: 'Failed to update status',
              }
            );
          }}
          defaultValue={task?.status_id.toString() ?? ''}
          placeholder="Search status"
        />
        <CommandBox
          label="Priority"
          commandOptions={
            taskPriorities?.map(priority => ({
              icon: taskIdToIcon[priority.id] ?? Dot,
              label: priority.label,
              value: priority.id.toString(),
            })) ?? []
          }
          commandKey="P"
          onChange={priorityId => {
            toast.promise(
              mutate.mutateAsync({
                id: taskId,
                priority_id: priorityId ? Number(priorityId) : undefined,
              }),
              {
                error: 'Failed to update priority',
              }
            );
          }}
          defaultValue={task?.priority_id.toString() ?? ''}
          placeholder="Search priority"
        />
        <ComboboxAsync<{
          user_id: string;
          name: string | null;
          email: string;
        }>
          label="Assignee"
          fetcher={async value => {
            const { data } = await postgrest
              .schema(environment_schema)
              .from('user')
              .select('user_id, name, email')
              .or(`name.ilike.%${value}%,email.ilike.%${value}%`)
              .limit(10);
            return data ?? [];
          }}
          initalFetcher={
            task?.assignee
              ? // eslint-disable-next-line @typescript-eslint/require-await
                async () => {
                  return [
                    {
                      user_id: task.assignee?.user_id ?? '',
                      name: task.assignee?.name ?? '',
                      email: task.assignee?.email ?? '',
                    },
                  ];
                }
              : undefined
          }
          onChange={(value: string) => {
            toast.promise(
              mutate.mutateAsync({
                id: taskId,
                assignee_id: value,
              }),
              {
                error: 'Failed to update assignee',
              }
            );
          }}
          value={task?.assignee_id ?? ''}
          placeholder="Select an assignee"
          renderOption={option => <UserOption user={option} />}
          getOptionValue={option => option.user_id}
          getDisplayValue={option => <UserOption user={option} />}
        />
        <ComboboxAsync<{
          id: string;
          label: string;
          opportunity: {
            id: string;
            label: string | null;
          } | null;
        }>
          label="Deal"
          fetcher={async value => {
            const { data } = await postgrest
              .schema(environment_schema)
              .from('deal')
              .select(
                'id,label,opportunity!opportunity_active_deal_id_fkey(id,label)'
              )
              .or(`label.ilike.*${value}*`)
              .limit(10);
            return data ?? [];
          }}
          initalFetcher={
            task?.deal
              ? // eslint-disable-next-line @typescript-eslint/require-await
                async () => {
                  return [
                    {
                      id: task.deal?.id ?? '',
                      label: task.deal?.label ?? '',
                      opportunity: {
                        id: task.deal?.opportunity?.id ?? '',
                        label: task.deal?.opportunity?.label ?? '',
                      },
                    },
                  ];
                }
              : undefined
          }
          onChange={(value: string) => {
            toast.promise(
              mutate.mutateAsync({
                id: taskId,
                deal_id: value,
              }),
              {
                error: 'Failed to update deal',
              }
            );
          }}
          value={task?.deal_id ?? ''}
          placeholder="Select a deal"
          renderOption={option => <DealOption deal={option} />}
          getOptionValue={option => option.id}
          getDisplayValue={option => <DealOption deal={option} />}
        />
      </div>
    </PageWrapperWithNav>
  );
}
