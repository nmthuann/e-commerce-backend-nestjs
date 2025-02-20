import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GuardError } from 'src/constants/errors.enum';
import { Role } from 'src/constants/role.enum';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //  get context in reflector
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    else {
      const request = context.switchToHttp().getRequest();
      const payload = request['user'];
      if (payload['role'] == Role.Admin) {
        throw new ForbiddenException(GuardError.NOT_USER);
      }
      request['email'] = payload['email'];
      return true;
    }
  }
}
