import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { IAuthService } from './auth.service.interface'
import { AuthResponse } from './dtos/responses/auth.response'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { IUserService } from '../users/services/user.service.interface'
import * as bcrypt from 'bcrypt'
import { JwtPayload } from 'src/common/types/jwt-payload.type'
import { Tokens } from 'src/common/types/token.type'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { EnvironmentVariables } from 'src/config/env.validation'
import { Role } from 'src/common/enums/role.enum'

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
    @Inject('IUserService')
    private readonly userService: IUserService
  ) {}

  async login(data: LoginDto): Promise<AuthResponse> {
    const getUser = await this.userService.getOneByEmail(data.email)

    if (!getUser) {
      throw new NotFoundException('Tài khoản không tồn tại!')
    }

    const checkPass = await this.comparePassword(data.password, getUser.password)
    if (!checkPass) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng!')
    }

    // TODO(P2.2/P2.4): thêm position cho nhân viên STAFF
    const payload: JwtPayload = {
      sub: getUser.id,
      email: getUser.email,
      role: getUser.roleType as Role
    }
    const tokens: Tokens = await this.getTokens(payload)

    await this.userService.updateRefreshToken(getUser.id, tokens.refreshToken)

    return {
      email: getUser.email,
      firstName: getUser.firstName,
      lastName: getUser.lastName,
      avatarUrl: getUser.avatarUrl,
      phone: getUser.phone,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }
  }

  register(data: RegisterDto): Promise<AuthResponse> {
    throw new Error('Method not implemented.')
  }

  private async comparePassword(password: string, storePasswordHash: string): Promise<any> {
    return await bcrypt.compare(password, storePasswordHash)
  }

  private async getTokens(payload: JwtPayload): Promise<Tokens> {
    const [jwt, refreshjwt] = await Promise.all([
      // Access token dùng secret + thời hạn mặc định của JwtModule (AuthModule)
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('REFRESH_JWT_SECRET_KEY', { infer: true }),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', { infer: true })
      })
    ])

    return {
      accessToken: jwt,
      refreshToken: refreshjwt
    }
  }
}
