import { EmployeeDto } from '../domain/dtos/employee.dto'

export interface IEmployeeService {
  getOneByUserId(userId: string): Promise<EmployeeDto>
}
