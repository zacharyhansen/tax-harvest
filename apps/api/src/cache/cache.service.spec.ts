import type { TestingModule } from '@nestjs/testing'

import { Test } from '@nestjs/testing'

import { CacheService } from './cache.service'

describe('cacheService', () => {
  let service: CacheService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheService],
    }).compile()

    service = module.get<CacheService>(CacheService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
