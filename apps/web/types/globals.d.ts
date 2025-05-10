export {}

// Create a type for the roles
export type Roles = 'admin'

declare global {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}
