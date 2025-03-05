import type { AppTrpcContext } from "~/auth/types";

import { Ctx, Input, Mutation, Query, Router } from "nestjs-trpc";
import { z } from "zod";

import {
  LinkTokeOutputSchema,
  type PlaidLinkOnSuccessMetadata,
  PlaidLinkOnSuccessMetadataSchema,
} from "./plaid.dto";
import { PlaidService } from "./plaid.service";

@Router({ alias: "plaid" })
export class PlaidRouter {
  constructor(private readonly plaidService: PlaidService) {}

  @Query({
    output: LinkTokeOutputSchema,
  })
  async linkToken(@Ctx() context: AppTrpcContext) {
    const plaidResponse = await this.plaidService.linkToken({
      userId: context.clerkclaims.sub,
    });

    return { linkToken: plaidResponse.data.link_token };
  }

  @Mutation({
    output: z.array(z.string()),
    input: z.object({
      publicToken: z.string(),
      metaData: PlaidLinkOnSuccessMetadataSchema,
    }),
  })
  async setAccessTokenAndSyncAccounts(
    @Ctx() context: AppTrpcContext,
    @Input("publicToken")
    publicToken: string,
    @Input("metaData")
    metaData: PlaidLinkOnSuccessMetadata,
  ) {
    const accounts = await this.plaidService.setAccessToken({
      metaData,
      portfolioId: context.clerkclaims.metadata.portfolioId,
      publicToken,
      userId: context.clerkclaims.sub,
    });

    return accounts.map(account => account.id);
  }
}
