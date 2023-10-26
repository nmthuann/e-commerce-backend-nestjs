import { IBaseService } from 'src/modules/bases/base.interface';
import { EmployeeDto } from './employee-dto/employee.dto';
// import { CreateEmployeeDto } from "./employee-dto/employee.dto";
import { EmployeeEntity } from './employee.entity';
import { GetEmployeeListDto } from './employee-dto/get-employee-list.dto';

export interface IEmployeeService extends IBaseService<EmployeeEntity> {
  // createOne(data: CreateEmployeeDto): Promise<EmployeeDto>;
  createNewEmployee(email: string, data: EmployeeDto): Promise<EmployeeEntity>;
  getEmployeeList(): Promise<GetEmployeeListDto[]>;
}
