import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { POSITIONS_KEY, ROLES_KEY } from '../decorators/roles.decorator'
import { GuardError } from '../enums/errors.enum'
import { Position, Role } from '../enums/role.enum'
import { AuthRequest } from '../types/auth-request.type'

// Global guard #2 (chạy sau AuthGuard): kiểm @Roles() và @Positions()
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const targets = [context.getHandler(), context.getClass()]
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, targets)
    const positions = this.reflector.getAllAndOverride<Position[]>(POSITIONS_KEY, targets)
    if (!roles?.length && !positions?.length) return true

    const user = context.switchToHttp().getRequest<AuthRequest>().user
    if (!user) throw new ForbiddenException(GuardError.ACCESS_DENIED)
    if (user.role === Role.ADMIN) return true

    const roleAllowed = roles?.includes(user.role) ?? false
    const positionAllowed = user.role === Role.STAFF && (positions?.includes(user.position) ?? false)
    if (roleAllowed || positionAllowed) return true

    throw new ForbiddenException(GuardError.ACCESS_DENIED)
  }
}
