import { IBaseService } from "src/modules/bases/base.interface";
import { EmployeeDto } from "./employee-dto/employee.dto";
import { CreateEmployeeDto } from "./employee-dto/create-employee.dto";

export interface IEmployeeService extends IBaseService<EmployeeDto>{
    // createOne(data: CreateEmployeeDto): Promise<EmployeeDto>;
}