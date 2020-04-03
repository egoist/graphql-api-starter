import { createParamDecorator } from 'type-graphql'
import { Request } from 'express'

export type Context = {
  request: Request
}

export function GqlContext() {
  return createParamDecorator<Context>(({ context }) => context)
}