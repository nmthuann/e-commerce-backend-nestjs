import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/modules/bases/base.abstract";
import { EmployeeDto } from "./employee-dto/employee.dto";
import { IEmployeeService } from "./employee.service.interface";
import { EmployeeEntity } from "./employee.entity";
import { Repository } from "typeorm";

@Injectable()
export class EmployeeService extends BaseService<EmployeeDto> implements IEmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity) 
    private employeeRepository: Repository<EmployeeDto>) {
        super(employeeRepository);
    }
}