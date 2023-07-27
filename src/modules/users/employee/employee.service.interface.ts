import { IBaseService } from "src/modules/bases/base.interface";
import { EmployeeDto } from "./employee-dto/employee.dto";

export interface IEmployeeService extends IBaseService<EmployeeDto>{
}