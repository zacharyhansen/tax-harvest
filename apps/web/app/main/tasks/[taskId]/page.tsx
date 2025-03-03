'use client';

import type { TypedRoutes } from '~/lib/routes';
import Task from '~/modules/task/task';

interface TaskPageProps {
  params: typeof TypedRoutes.task.params;
}

export default function TaskPage({ params }: TaskPageProps) {
  const { taskId } = params;
  return <Task taskId={taskId} />;
}
