import { Injectable } from "@nestjs/common";

import { EtradeService } from "../etrade/etrade.service";
import { AuthSource } from "@prisma/client";
import { AuthConnection, Prisma } from "@prisma/client";
import { PlaidService } from "../plaid/plaid.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthConnectionService {
  constructor(
    readonly prismaService: PrismaService,
    private readonly etradeService: EtradeService,
    private readonly plaidService: PlaidService,
  ) {}

  async syncAuthConnection({
    authConnection,
    id,
    select,
    userId,
  }: {
    id?: string;
    authConnection?: AuthConnection;
    userId: string;
    select: Prisma.AuthConnectionSelect;
  }): Promise<AuthConnection> {
    if (!id && !authConnection) {
      throw new Error("You must provide an id or existing connection to sync");
    }

    const connection =
      authConnection ??
      (await this.prismaService.authConnection.findUniqueOrThrow({
        where: {
          id,
        },
      }));

    switch (connection.source) {
      case AuthSource.ETRADE_ACCESS: {
        return this.etradeService.sync({
          authConnection: connection,
          select,
          userId,
        });
      }
      case AuthSource.PLAID: {
        await this.plaidService.syncPlaidItem({
          plaidAuthConnection: connection,
        });
        return connection;
      }
      default: {
        throw new Error(`Not implemented: ${connection.source}`);
      }
    }
  }

  resolveRequestOauth({
    authSource,
    portfolioId,
    userId,
  }: {
    portfolioId: string;
    userId: string;
    authSource: AuthSource;
  }) {
    switch (authSource) {
      case AuthSource.ETRADE_REQUEST: {
        return this.etradeService.requestOauthConnection({
          portfolioId,
          userId,
        });
      }
      default: {
        throw new Error(`Not implemented: ${authSource}`);
      }
    }
  }

  resolveAccessOauth({
    authSource,
    portfolioId,
    select,
    userId,
    verifier,
  }: {
    portfolioId: string;
    userId: string;
    authSource: AuthSource;
    verifier: string;
    select: Prisma.AuthConnectionSelect;
  }) {
    switch (authSource) {
      case AuthSource.ETRADE_ACCESS: {
        return this.etradeService.accessOauthConnection({
          portfolioId,
          select,
          userId,
          verifier,
        });
      }
      default: {
        throw new Error(`Not implemented: ${authSource}`);
      }
    }
  }

  // async authConnectionExt(
  //   id: string,
  //   select: Prisma.AuthConnectionSelect,
  // ): Promise<AuthConnectionExt> {
  //   const authConnection =
  //     await this.prismaService.authConnection.findUniqueOrThrow({
  //       select: {
  //         ...select,
  //         authedAt: true,
  //         source: true,
  //       },
  //       where: {
  //         id,
  //       },
  //     });
  //   return {
  //     ...authConnection,
  //     _requiresReAuth: this.requiresReAuth(
  //       authConnection.source,
  //       authConnection.authedAt,
  //     ),
  //   } satisfies AuthConnectionExt;
  // }

  requiresReAuth(source: AuthSource, authedAt: Date) {
    switch (source) {
      case AuthSource.ETRADE_ACCESS: {
        const now = new Date();
        const twentyFourHoursAgo = new Date(
          now.getTime() - 24 * 60 * 60 * 1000,
        );
        return authedAt < twentyFourHoursAgo;
      }
      case AuthSource.PLAID: {
        return true;
      }
      case AuthSource.LOCAL: {
        return false;
      }
      default: {
        throw new Error(`Not implemented: ${source}`);
      }
    }
  }
}
