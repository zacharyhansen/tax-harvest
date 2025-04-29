import { clerkClient } from "@clerk/clerk-sdk-node";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const ClerkContext = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const gqlContext = GqlExecutionContext.create(context).getContext();

    return clerkClient.verifyToken(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      gqlContext.req.headers.authorization?.split(" ")[1],
    );
  },
);
