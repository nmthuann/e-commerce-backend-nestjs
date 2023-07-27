import { IBaseService } from "src/modules/bases/base.interface";
import { UserDto } from "./user-dto/user.dto";

export interface IUserService extends IBaseService<UserDto>{
}