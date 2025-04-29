import { redirect } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Dashboard() {
  redirect('/main/home');
}
