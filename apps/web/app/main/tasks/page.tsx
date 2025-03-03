import { LayoutSlug } from '~/lib/constants/layout.slugs';
import { LayoutWrapper } from '~/modules/layout';
import { TaskTable } from '~/modules/task';

export default function Page() {
  return (
    <LayoutWrapper layoutSlug={LayoutSlug.TASKS}>
      <TaskTable />
    </LayoutWrapper>
  );
}
