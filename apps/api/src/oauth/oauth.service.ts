import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OauthService {
  constructor(private readonly configService: ConfigService) {
    // this.etradeOuath = new OAuth(
    //     this.configService.get('ETRADE_SANDBOX_ZACH'),
    //     this.configService.get(''),
    //     this.apiKey,
    //     this.apiSecret,
    //     '1.0',
    //     this.callbackURL,
    //     'HMAC-SHA1',
    //   );
  }

  etradeOuath() {}
}
