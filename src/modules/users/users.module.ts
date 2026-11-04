import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmployeeEntity } from './employees/employee.entity'
import { EmployeesController } from './employees/employees.controller'
import { EmployeesService } from './employees/employees.service'
import { PositionEntity } from './positions/position.entity'
import { PositionsController } from './positions/positions.controller'
import { PositionsService } from './positions/positions.service'
import { AdminUsersController } from './users/admin-users.controller'
import { UserEntity } from './users/user.entity'
import { UsersController } from './users/users.controller'
import { UsersService } from './users/users.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PositionEntity, EmployeeEntity])],
  controllers: [UsersController, AdminUsersController, PositionsController, EmployeesController],
  providers: [UsersService, PositionsService, EmployeesService],
  exports: [UsersService, EmployeesService]
})
export class UsersModule {}
