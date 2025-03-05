import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './controllers/user.controller'
import { PositionController } from './controllers/position.controller'
import { UserEntity } from './domain/entities/user.entity'
import { EmployeeEntity } from './domain/entities/employee.entity'
import { PositionEntity } from './domain/entities/position.entity'
import { UserService } from './services/impl/user.service'
import { PositionService } from './services/impl/position.service'
import { AuthMiddleware } from 'src/middlewares/auth.middleware'
import { JwtModule } from '@nestjs/jwt'
import { EmployeeService } from './services/impl/employee.service'
import { EmployeeController } from './controllers/employee.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, EmployeeEntity, PositionEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY
    })
  ],
  controllers: [UserController, PositionController, EmployeeController],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService
    },
    {
      provide: 'IPositionService',
      useClass: PositionService
    },
    {
      provide: 'IEmployeeService',
      useClass: EmployeeService
    }
  ],
  exports: ['IUserService', 'IPositionService', 'IEmployeeService']
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'users', method: RequestMethod.GET })
      .forRoutes(UserController, EmployeeController)
  }
}
