import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from './domain/entities/employee.entity';
import { EmployeeController } from './domain/controllers/employee.controller';
import { EmployeeService } from './domain/services/employee.service';
import { PositionEntity } from './domain/entities/position.entity';
import { PositionController } from './domain/controllers/position.controller';
import { PositionService } from './domain/services/position.service';
import { AdminUserController } from './domain/controllers/admin-user.controller';
import { UserEntity } from './domain/entities/user.entity';
import { UserController } from './domain/controllers/user.controller';
import { UserService } from './domain/services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PositionEntity, EmployeeEntity]),
  ],
  controllers: [
    UserController,
    AdminUserController,
    PositionController,
    EmployeeController,
  ],
  providers: [UserService, PositionService, EmployeeService],
  exports: [UserService, EmployeeService],
})
export class UsersModule {}
