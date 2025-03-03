import { clerkClient } from "@clerk/clerk-sdk-node";
import { Injectable, Logger } from "@nestjs/common";
import { TRPCError } from "@trpc/server";
import { type ContextOptions, type TRPCContext } from "nestjs-trpc";

import { ClerkClaims } from "../types";
@Injectable()
export class AppContext implements TRPCContext {
  private readonly logger = new Logger(AppContext.name);

  async create({ req }: ContextOptions): Promise<Record<string, unknown>> {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing token" });
    }
    try {
      const clerkclaims = (await clerkClient.verifyToken(
        token,
      )) as unknown as ClerkClaims;

      if (!token) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing token" });
      }

      if (
        !clerkclaims.environment_schema ||
        !clerkclaims.configuration_schema
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "Missing environment or configuration schema for organization",
        });
      }

      return {
        clerkclaims,
      };
    } catch (error) {
      this.logger.error(`Invalid clerk token: ${JSON.stringify(error)}`);
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });
    }
  }
}
