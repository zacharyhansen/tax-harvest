'use client';

import {
  OrganizationList,
  OrganizationSwitcher,
  SignedIn,
  useAuth,
  UserButton,
} from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function OrganizationSelection() {
  const auth = useAuth();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirectUrl') ?? '/';

  return (
    <div>
      {JSON.stringify(auth)}
      <OrganizationList
      // hidePersonal={true}
      // afterCreateOrganizationUrl={redirectUrl}
      // afterSelectOrganizationUrl={redirectUrl}
      />
      <SignedIn>
        <OrganizationSwitcher hidePersonal={false} />
        <UserButton />
      </SignedIn>
    </div>
  );
}
