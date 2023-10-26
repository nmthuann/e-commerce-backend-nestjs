import { IBaseService } from 'src/modules/bases/base.interface';
import { UserEntity } from './user.entity';
import { EmployeeEntity } from '../employee/employee.entity';

export interface IUserService extends IBaseService<UserEntity> {
  // createEmployee(data: UserDto): Promise<UserEntity>;
  getEmployeeByEmail(email: string): Promise<EmployeeEntity>;
  getUserByEmail(email: string): Promise<UserEntity>;
  getUsersIsEmployee(): Promise<UserEntity[]>;
}
