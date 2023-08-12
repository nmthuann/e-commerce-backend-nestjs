import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

    canActivate(context: ExecutionContext): boolean {

      //  get context in reflector
      const isPublic = this.reflector.getAllAndOverride('isPublic', [
        context.getHandler(),
        context.getClass(), 
      ]);

      //  check the request is public
      if (isPublic) return true;
      else{
        const request = context.switchToHttp().getRequest();
        console.log(request);
        const payload = request['user'];
        if (!payload){
          throw new ForbiddenException('Access denied'); 
        }
        request['email'] = payload['email'];
        return true;
      }
    }  
}