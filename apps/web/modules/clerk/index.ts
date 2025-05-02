import { auth } from '@clerk/nextjs/server';

import type { Roles } from '~/types/globals';

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth();
  return sessionClaims?.metadata.role === role;
};
