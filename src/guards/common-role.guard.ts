import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GuardError } from '../constants/errors.enum'

@Injectable()
export class CommonRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()])
    if (isPublic) return true
    else {
      const request = context.switchToHttp().getRequest()
      const payload = request['user']

      // role phải có
      if (!payload['role']) {
        throw new ForbiddenException(GuardError.ACCESS_DENIED)
      }

      request['userId'] = payload['userId']
      return true
    }
  }
}
