import { Module } from '@nestjs/common';
import { PortfolioConnectResolver } from './portfolio-connect.resolver';

@Module({
	providers: [PortfolioConnectResolver],
})
export class PortfolioConnectModule {}
