import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { restClient } from '@polygon.io/client-js'

import { PolygonResolver } from './polygon.resolver'
import { PolygonService } from './polygon.service'

@Module({
  exports: [PolygonService],
  imports: [],
  providers: [
    PolygonService,
    PolygonResolver,
    {
      inject: [ConfigService],
      provide: 'POLYGON_CLIENT',
      useFactory: (configService: ConfigService) =>
        restClient(configService.get('POLYGON_API_KEY')),
    },
  ],
})
export class PolygonModule {}
