import { HealthController } from '~/health/health.controller'

describe('healthController', () => {
  let healthController: HealthController

  beforeEach(() => {
    healthController = new HealthController()
  })

  describe('run', () => {
    it('should return is healthy', () => {
      expect(healthController.run()).toEqual({ status: 'ok' })
    })
  })
})
