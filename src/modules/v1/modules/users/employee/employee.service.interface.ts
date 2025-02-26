import { IBaseService } from 'src/modules/v1/bases/base.interface';
import { EmployeeDto } from './employee-dto/employee.dto';
import { EmployeeEntity } from './employee.entity';
import { GetEmployeeListDto } from './employee-dto/get-employee-list.dto';

export interface IEmployeeService extends IBaseService<EmployeeEntity> {
  createNewEmployee(email: string, data: EmployeeDto): Promise<EmployeeEntity>;
  getEmployeeList(): Promise<GetEmployeeListDto[]>;
}
