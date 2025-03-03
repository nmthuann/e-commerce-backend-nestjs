import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { IAuthService } from './auth.service.interface'
import { AuthResponse } from './dtos/auth.response'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { IUserService } from '../users/services/user.service.interface'
import * as bcrypt from 'bcrypt'
import { Payload } from 'src/common/types/payload.type'
import { Tokens } from 'src/common/types/token.type'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
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

    const payload: Payload = {
      userId: getUser.id,
      email: getUser.email,
      role: getUser.roleType
    }
    const tokens: Tokens = await this.getTokens(payload)

    await this.userService.updateRefreshToken(getUser.id, tokens.refreshToken)

    return {
      email: getUser.email,
      firstName: getUser.firstName,
      lastName: getUser.lastName,
      avatarUrl: getUser.avatarUrl,
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

  private async getTokens(payload: Payload): Promise<Tokens> {
    const [jwt, refreshjwt] = await Promise.all([
      this.jwtService.signAsync(
        { payload },
        {
          secret: 'JWT_SECRET_KEY',
          expiresIn: 60 * 15
        }
      ),
      this.jwtService.signAsync(
        { payload },
        {
          secret: 'REFRESH_JWT_SECRET_KEY',
          expiresIn: 60 * 60 // 60 * 60 * 24
        }
      )
    ])

    return {
      accessToken: jwt,
      refreshToken: refreshjwt
    }
  }
}
