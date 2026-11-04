import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthRequest } from '../types/auth-request.type'
import { JwtPayload } from '../types/jwt-payload.type'

// @CurrentUser() → JwtPayload | undefined, @CurrentUser('sub') → userId
export const CurrentUser = createParamDecorator((field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
  const user = ctx.switchToHttp().getRequest<AuthRequest>().user
  return field ? user?.[field] : user
})
