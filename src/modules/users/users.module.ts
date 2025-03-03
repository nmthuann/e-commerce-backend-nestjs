import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './controllers/user.controller'
import { PositionController } from './controllers/position.controller'
import { UserEntity } from './domain/entities/user.entity'
import { EmployeeEntity } from './domain/entities/employee.entity'
import { PositionEntity } from './domain/entities/position.entity'
import { UserService } from './services/impl/user.service'
import { PositionService } from './services/impl/position.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, EmployeeEntity, PositionEntity])],
  controllers: [UserController, PositionController],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService
    },
    {
      provide: 'IPositionService',
      useClass: PositionService
    }
  ],
  exports: ['IUserService', 'IPositionService']
})
export class UsersModule {}
