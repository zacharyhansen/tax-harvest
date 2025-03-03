import { z } from "zod";

export const envSchema = z.object({
  CLIENT_ORIGIN: z.string(),
  SECRET_SOURCE: z.enum(["LOCAL", "GCP"]),
  DATABASE_URL: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_HOST: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_PORT: z.string(),
  CLERK_PUBLIC_JWT: z.string(),
  POSTGREST_ORIGIN: z.string(),
  CLERK_SECRET_KEY: z.string(),
  PORT: z.string(),
});

export type Env = z.infer<typeof envSchema>;
