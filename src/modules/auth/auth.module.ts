import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { EnvironmentVariables } from 'src/config/env.validation'
import { UsersModule } from 'src/modules/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    // global: JwtService (mặc định ký/verify access token) dùng được ở mọi nơi, kể cả AuthContextMiddleware
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => ({
        secret: config.get('JWT_SECRET_KEY', { infer: true }),
        signOptions: { expiresIn: config.get('JWT_ACCESS_EXPIRES_IN', { infer: true }) }
      })
    }),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
