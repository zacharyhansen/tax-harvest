// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable turbo/no-undeclared-env-vars */
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const clientEnvironment = createEnv({
  client: {
    NEXT_PUBLIC_POSTGREST_URL: z.string().url(),
    NEXT_PUBLIC_CORE_SERVER_URL: z.string().url(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_POSTGREST_URL: process.env.NEXT_PUBLIC_POSTGREST_URL,
    NEXT_PUBLIC_CORE_SERVER_URL: process.env.NEXT_PUBLIC_CORE_SERVER_URL,
  },
});
