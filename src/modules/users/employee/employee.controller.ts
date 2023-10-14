import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards, HttpCode } from '@nestjs/common';
import { EmployeeDto } from '../employee/employee-dto/employee.dto';
import { IEmployeeService } from './Employee.service.interface';
import { CreateEmployeeDto } from './employee-dto/create-employee.dto';
import { EmployeeEntity } from './employee.entity';
import { GetEmployeeListDto } from './employee-dto/get-employee-list.dto';

// working with DTO
@Controller('employee') 
export class EmployeeController {
    
    constructor(@Inject('IEmployeeService')
        private employeeService: IEmployeeService
    ) {}

    


    @Post('create/:email')
    @HttpCode(200)
    async createNewEmployee (
        @Param('email') email: string, 
        @Body() employee: CreateEmployeeDto
    ): Promise<EmployeeEntity> {
        console.log("employee",employee, "email",email )
        return await this.employeeService.createNewEmployee(email, employee);
    }


    @Put('update/:id')
    async updateEmployeeById(@Param('id') id: number, @Body() employeeDto: EmployeeDto): Promise<EmployeeEntity> {
        return this.employeeService.updateOneById(id, employeeDto);
    }

    
    @Get('get-employees')
    async getEmployees(): Promise<EmployeeEntity[]> {
        return await this.employeeService.getAll();
    }

    @Get('get-employee-list')
    async getInformationEmployees(): Promise<GetEmployeeListDto[]> {
        return await this.employeeService.getEmployeeList();
    }


    // @Get(':id')
    // async getEmployee(@Param('id') id: number): Promise<EmployeeEntity> {
    //     return await this.employeeService.getOneById(id);
    // }
}