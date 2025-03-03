import { OrganizationSwitcher } from '@clerk/nextjs';

export default function Page() {
  return (
    <div>
      <OrganizationSwitcher />
      <h1>Page</h1>
    </div>
  );
}
