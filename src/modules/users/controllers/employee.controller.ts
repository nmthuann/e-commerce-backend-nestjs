import { Controller, Get, Inject, UseGuards, Request } from '@nestjs/common'
import { IEmployeeService } from '../services/employee.service.interface'
import { AdminRoleGuard } from 'src/guards/admin-role.guard'
import { UserRequest } from '../domain/dtos/request/user.request'

@Controller('employees')
export class EmployeeController {
  constructor(
    @Inject('IEmployeeService')
    private readonly employeeService: IEmployeeService
  ) {}

  @Get()
  @UseGuards(AdminRoleGuard)
  async getProfile(@Request() req: UserRequest) {
    console.log('Thông tin Profile User:', req.userId)
    return await this.employeeService.getOneByUserId(req.userId)
  }
}
