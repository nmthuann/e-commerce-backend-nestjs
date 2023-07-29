import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards } from '@nestjs/common';
import { EmployeeDto } from '../employee/employee-dto/employee.dto';
import { IEmployeeService } from './Employee.service.interface';
import { CreateEmployeeDto } from './employee-dto/create-employee.dto';

// working with DTO
@Controller('employee') 
export class EmployeeController {
    
    constructor(@Inject('IEmployeeService')
        private employeeService: IEmployeeService
    ) {}

    @Post('create')
    async createEmployee(@Body() employee: EmployeeDto): Promise<EmployeeDto> {
        return await this.employeeService.createOne(employee);
    }


    @Put('update/:id')
    async updateEmployeeById(@Param('id') id: number, @Body() employeeDto: EmployeeDto): Promise<EmployeeDto> {
        return this.employeeService.updateOneById(id, employeeDto);
    }


    @Delete('delete/:id')
    async deleteEmployeeById(@Param('id') id: number): Promise<void> {
        console.log(await this.employeeService.deleteOneById(id));
    }

    
    @Get('get-employees')
    async getEmployees(): Promise<EmployeeDto[]> {
        return await this.employeeService.getAll();
    }


    @Get(':id')
    async getEmployee(@Param('id') id: number): Promise<EmployeeDto> {
        return await this.employeeService.getOneById(id);
    }
}