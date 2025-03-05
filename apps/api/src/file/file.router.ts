import type { AppTrpcContext } from "~/auth/types";

import { Ctx, Input, Mutation, Query, Router } from "nestjs-trpc";
import { z } from "zod";

import { GoogleStorageService } from "~/google-storage/google-storage.service";

import { FileService } from "./file.service";

@Router({ alias: "file" })
export class FileRouter {
  constructor(
    private readonly googleStorageService: GoogleStorageService,
    private readonly fileService: FileService,
  ) {}

  // @Query({
  //   output: LinkTokeOutputSchema,
  // })
  // async linkToken(@Ctx() context: AppTrpcContext) {
  //   const plaidResponse = await this.plaidService.linkToken({
  //     userId: context.clerkclaims.sub,
  //   });

  //   return { linkToken: plaidResponse.data.link_token };
  // }
}
