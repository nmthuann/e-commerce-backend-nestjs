import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public.decorator'
import { IAuthService } from './auth.service.interface'
import { LoginDto } from './dtos/login.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService
  ) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() login: LoginDto) {
    return await this.authService.login(login)
  }
}
