import { Body, Controller, Get, Param, Post, Put, Inject, HttpCode } from '@nestjs/common'
import { IEmployeeService } from './Employee.service.interface'
import { EmployeeDto } from './employee-dto/employee.dto'
import { EmployeeEntity } from './employee.entity'
import { GetEmployeeListDto } from './employee-dto/get-employee-list.dto'

@Controller('/v1/employee')
export class EmployeeController {
  constructor(
    @Inject('IEmployeeService')
    private readonly employeeService: IEmployeeService
  ) {}

  @Post('create/:email')
  @HttpCode(200)
  async createNewEmployee(@Param('email') email: string, @Body() employee: EmployeeDto): Promise<EmployeeEntity> {
    console.log('employee', employee, 'email', email)
    return await this.employeeService.createNewEmployee(email, employee)
  }

  @Put('update/:id')
  async updateEmployeeById(@Param('id') id: number, @Body() employeeDto: EmployeeDto): Promise<EmployeeEntity> {
    return this.employeeService.updateOneById(id, employeeDto)
  }

  @Get('get-employees')
  async getEmployees(): Promise<EmployeeEntity[]> {
    return await this.employeeService.getAll()
  }

  @Get('get-employee-list')
  async getInformationEmployees(): Promise<GetEmployeeListDto[]> {
    return await this.employeeService.getEmployeeList()
  }
}
