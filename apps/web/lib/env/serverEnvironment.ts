import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const serverEnvironment = createEnv({
  server: {
    STRIPE_SECRET_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
  },
  experimental__runtimeEnv: process.env,
})
