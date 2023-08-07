import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards } from '@nestjs/common';
import { EmployeeDto } from '../employee/employee-dto/employee.dto';
import { IEmployeeService } from './Employee.service.interface';
import { CreateEmployeeDto } from './employee-dto/create-employee.dto';
import { EmployeeEntity } from './employee.entity';

// working with DTO
@Controller('employee') 
export class EmployeeController {
    
    constructor(@Inject('IEmployeeService')
        private employeeService: IEmployeeService
    ) {}

    // @Post('create')
    // async createEmployee(@Body() employee: EmployeeDto): Promise<EmployeeEntity> {
    //     return await this.employeeService.createOne(employee);
    // }


    @Post('create/:email')
    async createNewEmployee(@Param('email') email: string, @Body() employee: CreateEmployeeDto): Promise<EmployeeEntity> {
        
        return await this.employeeService.createNewEmployee(email, employee);
    }


    @Put('update/:id')
    async updateEmployeeById(@Param('id') id: number, @Body() employeeDto: EmployeeDto): Promise<EmployeeEntity> {
        return this.employeeService.updateOneById(id, employeeDto);
    }


    @Delete('delete/:id')
    async deleteEmployeeById(@Param('id') id: number): Promise<void> {
        console.log(await this.employeeService.deleteOneById(id));
    }

    
    @Get('get-employees')
    async getEmployees(): Promise<EmployeeEntity[]> {
        return await this.employeeService.getAll();
    }


    @Get(':id')
    async getEmployee(@Param('id') id: number): Promise<EmployeeEntity> {
        return await this.employeeService.getOneById(id);
    }
}