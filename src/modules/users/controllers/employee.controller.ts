import { Controller, Get, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'
import { Role } from 'src/common/enums/role.enum'
import { IEmployeeService } from '../services/employee.service.interface'

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(
    @Inject('IEmployeeService')
    private readonly employeeService: IEmployeeService
  ) {}

  @Get()
  @Roles(Role.STAFF)
  async getProfile(@CurrentUser('sub') userId: string) {
    return await this.employeeService.getOneByUserId(userId)
  }
}
