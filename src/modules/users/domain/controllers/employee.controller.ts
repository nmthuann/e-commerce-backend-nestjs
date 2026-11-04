import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PageDto } from 'src/common/dto/page.dto';
import { Role } from 'src/common/enums/role.enum';
import {
  CreateEmployeeDto,
  GetEmployeesQueryDto,
  UpdateEmployeeDto,
} from '../dto/employee.dto';
import { EmployeeEntity } from '../entities/employee.entity';
import { EmployeeService } from '../services/employee.service';

@ApiTags('Admin - Employees')
@Roles(Role.ADMIN)
@Controller('admin/employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  findAll(
    @Query() query: GetEmployeesQueryDto,
  ): Promise<PageDto<EmployeeEntity>> {
    return this.employeeService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<EmployeeEntity> {
    return this.employeeService.findById(id);
  }

  /** Tạo nhân viên = tạo tài khoản STAFF + hồ sơ nhân viên */
  @Post()
  create(@Body() data: CreateEmployeeDto): Promise<EmployeeEntity> {
    return this.employeeService.create(data);
  }

  /** Đổi vị trí, lương, hoặc cho nghỉ việc (isActive=false) */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateEmployeeDto,
  ): Promise<EmployeeEntity> {
    return this.employeeService.update(id, data);
  }
}
