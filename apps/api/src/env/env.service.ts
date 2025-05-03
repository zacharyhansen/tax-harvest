import type { ConfigService } from '@nestjs/config'
import type { Env } from './env.schema'

import { Global, Injectable } from '@nestjs/common'

@Global()
@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  get<TKey extends keyof Env>(key: TKey) {
    return this.configService.get<Env[TKey]>(key)
  }
}
