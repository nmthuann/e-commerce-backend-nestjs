import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/common/decorators/roles.decorator'
import { PageDto } from 'src/common/dto/page.dto'
import { Role } from 'src/common/enums/role.enum'
import { CreateEmployeeDto, GetEmployeesQueryDto, UpdateEmployeeDto } from './employee.dto'
import { EmployeeEntity } from './employee.entity'
import { EmployeesService } from './employees.service'

@ApiTags('Admin - Employees')
@Roles(Role.ADMIN)
@Controller('admin/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  findAll(@Query() query: GetEmployeesQueryDto): Promise<PageDto<EmployeeEntity>> {
    return this.employeesService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<EmployeeEntity> {
    return this.employeesService.findById(id)
  }

  /** Tạo nhân viên = tạo tài khoản STAFF + hồ sơ nhân viên */
  @Post()
  create(@Body() data: CreateEmployeeDto): Promise<EmployeeEntity> {
    return this.employeesService.create(data)
  }

  /** Đổi vị trí, lương, hoặc cho nghỉ việc (isActive=false) */
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateEmployeeDto): Promise<EmployeeEntity> {
    return this.employeesService.update(id, data)
  }
}
