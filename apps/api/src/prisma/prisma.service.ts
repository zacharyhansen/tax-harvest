import { Injectable, OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import get from 'lodash.get';

const byPassSql = Prisma.sql`
  DO $$
  BEGIN
    PERFORM set_config('app.bypass_rls', 'on', TRUE);
    PERFORM set_config('app.current_portfolio_id', '00000000-0000-0000-0000-000000000000', TRUE);
  END;
  $$;
`;

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor() {
		super({
			errorFormat: 'pretty',
			// log: ['query', 'info', 'warn', 'error'],
		});
	}

	async onModuleInit() {
		await this.$connect();
	}

	rlsPortfolioClient(portfolioId: string): PrismaClient {
		// @ts-expect-error - this is a valid extension
		return this.$extends(PrismaService.forPortfolio(portfolioId));
	}

	rlsBypassClient(): PrismaClient {
		// @ts-expect-error - this is a valid extension
		return this.$extends(PrismaService.bypassRLS());
	}

	static bypassRLS() {
		return Prisma.defineExtension((prisma) =>
			prisma.$extends({
				client: {
					$transaction: (async (
						...txnParams: Parameters<typeof prisma.$transaction>
					) => {
						const [txnOps, txnOptions] = txnParams;

						if (Array.isArray(txnOps)) {
							// Inject as the first step of a batch operation
							const [_rlsHelper, ...result] = await prisma.$transaction(
								[prisma.$executeRaw(byPassSql), ...txnOps],
								txnOptions,
							);
							return result;
						}

						// Inject as the first step of an interactive transaction
						return prisma.$transaction(async (transaction) => {
							await transaction.$executeRaw(byPassSql);
							return txnOps(transaction);
						}, txnOptions);
					}) as typeof prisma.$transaction,
				},
				query: {
					$allModels: {
						async $allOperations({ args, query, ...rest }) {
							const existingTxn = get(rest, [
								'__internalParams',
								'transaction',
							]);
							if (existingTxn) return query(args); // handled via 'client' override
							const [_setRls, queryResult] = await prisma.$transaction([
								prisma.$executeRaw(byPassSql),
								query(args),
							]);
							return queryResult;
						},
					},
					async $allOperations({ args, model, query, ...rest }) {
						if (model) return query(args); // no override needed... should be handled in $allModels above

						// NOTE: inside a raw SQL operation like like '$queryRaw' or '$executeRaw'
						const existingTxn = get(rest, ['__internalParams', 'transaction']);
						if (existingTxn) return query(args); // already handled via client override

						const [_setRls, result] = await prisma.$transaction([
							prisma.$executeRaw(byPassSql),
							query(args),
						]);

						return result;
					},
				},
			}),
		);
	}

	static forPortfolio(portfolioId: string) {
		return Prisma.defineExtension((prisma) =>
			prisma.$extends({
				client: {
					$transaction: (async (
						...txnParams: Parameters<typeof prisma.$transaction>
					) => {
						const [txnOps, txnOptions] = txnParams;

						if (Array.isArray(txnOps)) {
							// Inject as the first step of a batch operation
							const [_rlsHelper, ...result] = await prisma.$transaction(
								[
									prisma.$executeRaw`SELECT set_config('app.current_portfolio_id', ${portfolioId}::text, TRUE)`,
									...txnOps,
								],
								txnOptions,
							);
							return result;
						}

						// Inject as the first step of an interactive transaction
						return prisma.$transaction(async (transaction) => {
							await transaction.$executeRaw`SELECT set_config('app.current_portfolio_id', ${portfolioId}::text, TRUE)`;
							return txnOps(transaction);
						}, txnOptions);
					}) as typeof prisma.$transaction,
				},
				query: {
					$allModels: {
						async $allOperations({ args, query, ...rest }) {
							const existingTxn = get(rest, [
								'__internalParams',
								'transaction',
							]);
							if (existingTxn) return query(args); // handled via 'client' override

							const [_setRls, result] = await prisma.$transaction([
								prisma.$executeRaw`SELECT set_config('app.current_portfolio_id', ${portfolioId}::text, TRUE)`,
								query(args),
							]);

							return result;
						},
					},
					async $allOperations({ args, model, query, ...rest }) {
						if (model) return query(args); // no override needed... should be handled in $allModels above

						// NOTE: inside a raw SQL operation like like '$queryRaw' or '$executeRaw'
						const existingTxn = get(rest, ['__internalParams', 'transaction']);
						if (existingTxn) return query(args); // already handled via client override

						const [_setRls, result] = await prisma.$transaction([
							prisma.$executeRaw`SELECT set_config('app.current_portfolio_id', ${portfolioId}::text, TRUE)`,
							query(args),
						]);

						return result;
					},
				},
			}),
		);
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}
}
