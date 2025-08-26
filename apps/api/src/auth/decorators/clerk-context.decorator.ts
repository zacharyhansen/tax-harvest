import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const ClerkContext = createParamDecorator(
	(_data: unknown, context: ExecutionContext) => {
		const gqlContext = GqlExecutionContext.create(context).getContext();

		return gqlContext.req.clerk_claims;
	},
);
