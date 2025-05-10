import { z } from 'zod'

export const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']),
  CLIENT_ORIGIN: z.string(),
  NUETRAL_HARVEST_THRESHOLD: z.coerce.number(),
  PORT: z.string(),
  // Database
  DATABASE_URL: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.string(),
  // Clerk
  CLERK_SECRET_KEY: z.string(),
  CLERK_USER_UPDATE_CREATE_WEBHOOK_SIGN_SECRET: z.string(),
  // Stripe
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_PUBLISHABLE_KEY: z.string(),
  // Plaid
  PLAID_SECRET_KEY: z.string(),
  PLAID_CLIENT_ID: z.string(),
  PLAID_ENV: z.string(),
  // Etrade
  ETRADE_API_KEY: z.string(),
  ETRADE_API_SECRET: z.string(),
  ETRADE_OAUTH_AUTHORIZE_URL: z.string(),
  ETRADE_HOSTNAME: z.string(),
  // Polygon
  POLYGON_API_KEY: z.string(),
  // Google
  GOOGLE_PROJECT: z.string(),
  GCS_LOTS_BUCKET_NAME: z.string(),
})

export type Env = z.infer<typeof envSchema>
