import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from './entities/employee.entity';
import { EmployeeController } from './controllers/employee.controller';
import { EmployeeService } from './services/employee.service';
import { PositionEntity } from './entities/position.entity';
import { PositionController } from './controllers/position.controller';
import { PositionService } from './services/position.service';
import { AdminUserController } from './controllers/admin-user.controller';
import { UserEntity } from './entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

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
