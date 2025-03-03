import { createEnv } from '@t3-oss/env-nextjs';

export const serverEnvironment = createEnv({
  server: {},
  experimental__runtimeEnv: process.env,
});
