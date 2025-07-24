// src/common/decorators/time-method.decorator.ts
import { Logger } from '@nestjs/common'

export function TimeMethod(context?: string) {
  return function (
    // eslint-disable-next-line ts/no-explicit-any
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value
    const logger = new Logger(context || target.constructor.name)

    // eslint-disable-next-line ts/no-explicit-any
    descriptor.value = async function (...args: any[]) {
      const start = process.hrtime.bigint()
      try {
        const result = await originalMethod.apply(this, args)
        return result
      }
      finally {
        const end = process.hrtime.bigint()
        const duration = Number(end - start) / 1_000_000 // Convert nanoseconds to milliseconds
        logger.log(`Method "${propertyKey}" executed in ${duration.toFixed(2)} ms.`)
      }
    }
    return descriptor
  }
}
