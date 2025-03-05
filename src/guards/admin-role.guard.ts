import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GuardError } from '../constants/errors.enum'
import { RoleType } from 'src/constants/role-type.enum'

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()])
    if (isPublic) return true
    else {
      const request = context.switchToHttp().getRequest()
      const payload = request['user']
      if (payload['role'] === RoleType.USER) {
        throw new ForbiddenException(GuardError.ACCESS_DENIED)
      }
      request['userId'] = payload['userId']
      return true
    }
  }
}
