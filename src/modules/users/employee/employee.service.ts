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
import { GetEmployeeListDto } from "./employee-dto/get-employee-list.dto";
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config(); 

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


  async getEmployeeList(): Promise<GetEmployeeListDto[]> {
    
    const getEmployeeList: GetEmployeeListDto[] = [];
    const findEmployees = await this.getAll();
    console.log(findEmployees)

    for(const employee of findEmployees){
      const getEmployee = new GetEmployeeListDto();
      getEmployee.avatar_url = (await Promise.resolve(employee.user)).avatar_url;
      getEmployee.employee_id = employee.employee_id;
      getEmployee.employee_name = 
        (await Promise.resolve(employee.user)).last_name + ' ' + (await Promise.resolve(employee.user)).first_name;
      getEmployee.birthday =  (await Promise.resolve(employee.user)).birthday.toLocaleDateString();
      getEmployee.gender = (await Promise.resolve(employee.user)).gender;
      getEmployee.salary = String(employee.salary * (await Promise.resolve(employee.position)).offer);
      getEmployee.position = (await Promise.resolve(employee.position)).position_name;
      getEmployee.create =  employee.createdAt.toLocaleDateString();
      getEmployee.work_status = employee.work_status; // === true ? 'Doing' : 'Left'
      getEmployee.address = (await Promise.resolve(employee.user)).address;
      
      getEmployeeList.push(getEmployee);
    }

    return getEmployeeList;
  }




}