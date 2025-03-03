import { redirect } from 'next/navigation';

import { TypedRoutes } from '~/lib/routes';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Dashboard() {
  redirect(TypedRoutes.home());
}
