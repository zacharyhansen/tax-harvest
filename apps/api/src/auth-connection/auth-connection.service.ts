import { Injectable } from '@nestjs/common'
import { AuthConnection, AuthSource, Prisma } from '@prisma/client'

import { EtradeService } from '../etrade/etrade.service'
import { PlaidService } from '../plaid/plaid.service'
import { PrismaService } from '../prisma/prisma.service'

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
    portfolioId,
  }: {
    id?: string
    authConnection?: AuthConnection
    userId: string
    select: Prisma.AuthConnectionSelect
    portfolioId: string
  }): Promise<AuthConnection> {
    if (!id && !authConnection) {
      throw new Error('You must provide an id or existing connection to sync')
    }

    const connection
      = authConnection
        ?? (await this.prismaService.$extends(this.prismaService.forPortfolio(portfolioId)).authConnection.findUniqueOrThrow({
          where: {
            id,
            portfolioId,
          },
        }))

    switch (connection.source) {
      case AuthSource.ETRADE_ACCESS: {
        return this.etradeService.sync({
          authConnection: connection,
          select,
          userId,
        })
      }
      case AuthSource.PLAID: {
        await this.plaidService.syncPlaidItem({
          plaidAuthConnection: connection,
        })
        return connection
      }
      default: {
        throw new Error(`Not implemented: ${connection.source}`)
      }
    }
  }

  resolveRequestOauth({
    authSource,
    portfolioId,
    userId,
  }: {
    portfolioId: string
    userId: string
    authSource: AuthSource
  }) {
    switch (authSource) {
      case AuthSource.ETRADE_REQUEST: {
        return this.etradeService.requestOauthConnection({
          portfolioId,
          userId,
        })
      }
      default: {
        throw new Error(`Not implemented: ${authSource}`)
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
    portfolioId: string
    userId: string
    authSource: AuthSource
    verifier: string
    select: Prisma.AuthConnectionSelect
  }) {
    switch (authSource) {
      case AuthSource.ETRADE_ACCESS: {
        return this.etradeService.accessOauthConnection({
          portfolioId,
          select,
          userId,
          verifier,
        })
      }
      default: {
        throw new Error(`Not implemented: ${authSource}`)
      }
    }
  }

  requiresReAuth(source: AuthSource, authedAt: Date) {
    switch (source) {
      case AuthSource.ETRADE_ACCESS: {
        const now = new Date()
        const twentyFourHoursAgo = new Date(
          now.getTime() - 24 * 60 * 60 * 1000,
        )
        return authedAt < twentyFourHoursAgo
      }
      case AuthSource.PLAID: {
        return true
      }
      case AuthSource.LOCAL: {
        return false
      }
      default: {
        throw new Error(`Not implemented: ${source}`)
      }
    }
  }
}
