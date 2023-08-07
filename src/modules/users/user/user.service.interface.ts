import { IBaseService } from "src/modules/bases/base.interface";
import { UserDto } from "./user-dto/user.dto";
import { UserEntity } from "./user.entity";

export interface IUserService extends IBaseService<UserEntity>{
    // createEmployee(data: UserDto): Promise<UserEntity>;
    getUserByEmail(email: string): Promise<UserEntity>;
    getUsersIsEmployee(): Promise<UserEntity[]>;
}