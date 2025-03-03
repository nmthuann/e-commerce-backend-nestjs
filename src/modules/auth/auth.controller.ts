import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common'
import { IAuthService } from './auth.service.interface'
import { LoginDto } from './dtos/login.dto'

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() login: LoginDto) {
    console.log(`<USER> ::: ${login.email} Đã vừa đăng nhập!`)
    return await this.authService.login(login)
  }
}
