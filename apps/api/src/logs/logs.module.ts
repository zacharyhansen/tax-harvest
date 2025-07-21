import { Module } from '@nestjs/common'
import { CustomScalar, Scalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'
import { LogsResolver } from './logs.resolver'
import { LogsService } from './logs.service'

@Scalar('bigint', () => String)
export class BigIntScalar implements CustomScalar<string, bigint> {
  description = 'BigInt custom scalar type'

  parseValue(value: unknown): bigint {
    return BigInt(value as string)
  }

  serialize(value: unknown): string {
    return (value as bigint).toString()
  }

  parseLiteral(ast: ValueNode): bigint {
    if (ast.kind === Kind.STRING) {
      return BigInt(ast.value)
    }
    throw new Error('Value must be a string or integer literal')
  }
}

@Module({
  providers: [LogsService, LogsResolver, BigIntScalar],
})
export class LogsModule { }
