import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/modules/bases/base.abstract";
import { EmployeeDto } from "./employee-dto/employee.dto";
import { IEmployeeService } from "./employee.service.interface";
import { EmployeeEntity } from "./employee.entity";
import { Repository } from "typeorm";
import { IPositionService } from "../position/position.service.interface";
import { IUserService } from "../user/user.service.interface";
import { UserDto } from "../user/user-dto/user.dto";
import { CreateEmployeeDto } from "./employee-dto/create-employee.dto";

@Injectable()
export class EmployeeService extends BaseService<EmployeeDto> implements IEmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity) 
    private employeeRepository: Repository<EmployeeDto>,
    @Inject('IPositionService')
    private positionService: IPositionService,
    @Inject('IUserService')
    private userService: IUserService,


    ){
      super(employeeRepository);
    }


  async createOne(employee: EmployeeDto): Promise<EmployeeDto> {
     try{
      const position_id = employee.position;
      const findPosition = await this.positionService.getOneById(position_id);

      const user_id = employee.user;
      const findUser = await this.userService.getOneById(user_id);
      console.log(findPosition, "findPosition", employee.user, "findUser : ", findUser);
      
     //const newEmployee = await this.employeeRepository.save({...findPosition, ...employee});
      //console.log("newEmployee: ", newEmployee);


 
      //findUser.employee = newEmployee;
      
      // const updateUser = await this.userService.updateOneById(employee.user.user_id, findUser);
      // console.log("updateUser : ", updateUser);

      return ;
    }catch (error) {
      throw new Error(`An unexpected error occurred while creating the user ${error}`);
    }
  }
}