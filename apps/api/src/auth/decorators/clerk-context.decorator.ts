import { clerkClient } from '@clerk/clerk-sdk-node'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const ClerkContext = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context).getContext()

    return clerkClient.verifyToken(
      gqlContext.req.headers.authorization?.split(' ')[1],
    )
  },
)
