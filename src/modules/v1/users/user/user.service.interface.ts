import { IBaseService } from 'src/common/bases/base.interface';
import { UserEntity } from './user.entity';
import { EmployeeEntity } from '../employee/employee.entity';

export interface IUserService extends IBaseService<UserEntity> {
  getEmployeeByEmail(email: string): Promise<EmployeeEntity>;
  getUserByEmail(email: string): Promise<UserEntity>;
  getUsersIsEmployee(): Promise<UserEntity[]>;
}
