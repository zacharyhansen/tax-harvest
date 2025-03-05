import { Module } from '@nestjs/common';

import { OauthService } from './oauth.service';

@Module({
  providers: [OauthService],
})
export class OauthModule {}
