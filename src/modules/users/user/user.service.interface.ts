import { IBaseService } from "src/modules/bases/base.interface";
import { UserDto } from "./user-dto/user.dto";
import { UserEntity } from "./user.entity";
import { GetCustomerListDto } from "./user-dto/get-customer-list.dto";
import { EmployeeEntity } from "../employee/employee.entity";

export interface IUserService extends IBaseService<UserEntity>{
    // createEmployee(data: UserDto): Promise<UserEntity>;
    getEmployeeByEmail(email: string): Promise<EmployeeEntity>;
    getUserByEmail(email: string): Promise<UserEntity>;
    getUsersIsEmployee(): Promise<UserEntity[]>;

}