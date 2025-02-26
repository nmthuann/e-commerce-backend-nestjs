import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AccountModule } from 'src/modules/v1/modules/users/account/account.module'
import { UserModule } from '../users/user/user.module'
import { EmployeeModule } from '../users/employee/employee.module'
import { AuthMiddleware } from '../../middlewares/auth.middleware'

@Module({
  imports: [
    JwtModule.register({
      secret: 'JWT_SECRET_KEY',
      signOptions: { expiresIn: 60 }
    }),
    // TypeOrmModule.forFeature([AccountEntity]),
    AccountModule,
    UserModule,
    EmployeeModule
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IAuthService',
      useClass: AuthService
    }
  ]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/admin/login', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/show-list', method: RequestMethod.GET },
        { path: 'auth/logout', method: RequestMethod.POST },
        { path: 'auth/register-employee', method: RequestMethod.POST }
        // { path: 'auth/register-employee/:email', method: RequestMethod.POST },
      )
      .forRoutes(AuthController)
  }
}
