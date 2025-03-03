import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    JwtModule.register({
      secret: 'JWT_SECRET_KEY',
      signOptions: { expiresIn: 60 }
    }),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IAuthService',
      useClass: AuthService
    }
  ]
})
export class AuthModule {}
