import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AdminGuard implements CanActivate {
	private readonly logger = new Logger(AdminGuard.name);

	getRequest(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		return ctx.getContext<{ req: Request }>().req;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const gqlContext = GqlExecutionContext.create(context).getContext();
			const role = gqlContext.req.clerk_claims.metadata.role;
			return role === 'admin';
		} catch (error) {
			this.logger.error(error);
			return false;
		}
	}
}
