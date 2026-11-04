import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { MiddlewareError } from '../enums/errors.enum'
import { AuthRequest } from '../types/auth-request.type'

// Global guard #1: mọi route đều cần đăng nhập, trừ route gắn @Public()
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest<AuthRequest>()
    if (request.user) return true

    throw new UnauthorizedException(request.authError ?? MiddlewareError.TOKEN_MISSING)
  }
}
