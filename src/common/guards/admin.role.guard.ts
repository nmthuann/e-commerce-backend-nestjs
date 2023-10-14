import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/modules/bases/enums/role.enum";
import { GuardError } from "../errors/errors";



@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    // private jwtService: JwtService,
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
        // console.log(request);
        const payload = request['user'];
        if (payload['role'] != Role.Admin){
          throw new ForbiddenException(GuardError.ACCESS_DENIED); 
        }
        request['email'] = payload['email'];
        return true;
      }
    }  
}