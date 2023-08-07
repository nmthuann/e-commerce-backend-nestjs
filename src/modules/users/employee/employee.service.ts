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
import { UserEntity } from "../user/user.entity";

@Injectable()
export class EmployeeService extends BaseService<EmployeeEntity> implements IEmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity) 
    private employeeRepository: Repository<EmployeeEntity>,
    @Inject('IPositionService')
    private positionService: IPositionService,
    @Inject('IUserService')
    private userService: IUserService,


    ){
      super(employeeRepository);
  }


  async getAll(): Promise<EmployeeEntity[]> {
    const findEmployee = await this.employeeRepository.find({
      relations:{
        user: true,
        position: true
      }
    })
    return findEmployee;
  }  




  async createNewEmployee(email: string, data: CreateEmployeeDto): Promise<EmployeeEntity> {
    /**
     * 1. Create new employee Table Employee
     * 2. Update Employee Id in Table User
     */
    // const queryRunner = this.employeeRepository.manager.connection.createQueryRunner();
    // await queryRunner.startTransaction();
    try {
      const findPosition = await this.positionService.getOneById(data.position_id);
      console.log(findPosition);
      const newEmployee = new EmployeeEntity();
      newEmployee.employee_id = data.employee_id;
      newEmployee.work_status = true;
      newEmployee.position = findPosition;
      newEmployee.salary = data.salary;

      // const employeeCreated = await queryRunner.manager.save(newEmployee);
      
      const employeeCreated = await this.employeeRepository.save(newEmployee);
      console.log("employeeCreated:::", employeeCreated)

      const findUser = await this.userService.getUserByEmail(email);
      console.log("findUser:::", findUser)
      findUser.employee = employeeCreated;
      // const updateUser: UserEntity = 
      await this.userService.updateOneById(findUser.user_id, findUser);
      //console.log("updateUser:::", updateUser)
      
      //await queryRunner.commitTransaction();
      return employeeCreated;
      
    } catch (error) {
      console.log(`Create New Employee lỗi ${error}`);
      //await queryRunner.rollbackTransaction();
      throw error;
    }
    // finally {
    //   // you need to release query runner which is manually created:
    //   await queryRunner.release();
    // }
  }



}