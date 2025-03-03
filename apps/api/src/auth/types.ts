import type { AuthSchema } from "kysely-codegen";

// TODO: Copied from clerk log since I could not find the type from clerk
export interface ClerkClaims {
  azp: string;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  // Note: this is technical possibly undefined on login but we enforce this on the sign in flow that it is created
  metadata: { orgId: string };
  nbf: number;
  sid: string;
  sub: string;
  environment_schema: AuthSchema;
  configuration_schema: AuthSchema;
}

export interface AppTrpcContext {
  clerkclaims: ClerkClaims;
}
