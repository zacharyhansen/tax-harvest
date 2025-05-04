import { GraphQLRequestContext } from '@apollo/server'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library'

export const errorFormatPlugin = {
  async requestDidStart() {
    return {
      async didEncounterErrors(
        ctx: GraphQLRequestContext<{ roles: string[], permissions: string[] }>,
      ) {
        // TODO: Show errors for internal users
        // const roles = ctx.contextValue?.roles;

        // Internal users can see full errors
        if (process.env.NODE_ENV === 'development') {
          return
        }

        // Hide query errors from non-internal users
        if (ctx.errors) {
          for (const error of ctx.errors) {
            if (error.originalError instanceof PrismaClientValidationError) {
              error.message = 'Input did not match the expected format'
              error.extensions.code = 'BAD_USER_INPUT'
              error.stack = undefined
              continue
            }

            if (error.originalError instanceof PrismaClientKnownRequestError) {
              switch (error.originalError.code) {
                case 'P2025': {
                  error.message = 'Resource not found'
                  error.extensions.code = 'NOT_FOUND'
                  error.stack = undefined
                  continue
                }

                default: {
                  error.message = 'Internal server error'
                  error.extensions.code = 'INTERNAL_SERVER_ERROR'
                  error.stack = undefined
                  continue
                }
              }
            }
          }
        }
      },
    }
  },
}
