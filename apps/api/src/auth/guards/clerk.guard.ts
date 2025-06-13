import { clerkClient } from '@clerk/clerk-sdk-node'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class ClerkGuard implements CanActivate {
  private readonly logger = new Logger()

  constructor(private reflector: Reflector) { }

  // Convert to graphql context
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext<{ req: Request }>().req
  }

  /**
   * Override canActivate function.
   * If decorated by Public then it is accessable otherwise we fall back to checking the request context
   */
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('public', [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    try {
      const gqlContext = GqlExecutionContext.create(context).getContext()
      const clerk_claims = await clerkClient.verifyToken(
        gqlContext.req.headers.authorization.split(' ')[1],
      )

      gqlContext.req.clerk_claims = clerk_claims
    }
    catch (error) {
      this.logger.error(error)
      return false
    }

    return true
  }
}
