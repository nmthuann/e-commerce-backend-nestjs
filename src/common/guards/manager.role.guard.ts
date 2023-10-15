import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/modules/bases/enums/role.enum";
import { GuardError } from "../errors/errors";
import { IUserService } from "src/modules/users/user/user.service.interface";



@Injectable()
export class ManagerRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    // private jwtService: JwtService,
    @Inject('IUserService')
    private userService: IUserService,
  ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

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
        else{
          const checkManager = await this.userService.getEmployeeByEmail(payload['email']);
          if(checkManager == null){
            request['email'] = payload['email'];
            return true;
          }
          return false;
        }
      }
    }  
}