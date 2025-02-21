import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { EmployeeEntity } from './entities/employee.entity';
import { PositionEntity } from './entities/position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, EmployeeEntity, PositionEntity])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
