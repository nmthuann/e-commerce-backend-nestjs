import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Public } from 'src/common/decorators/public.decorator'
import { AuthResponseDto, LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto'
import { AuthService } from './auth.service'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Đăng ký tài khoản khách hàng, trả về token như đăng nhập */
  @Public()
  @Post('register')
  register(@Body() data: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(data)
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() data: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(data)
  }

  /** Đổi refresh token lấy cặp token mới; refresh token cũ bị vô hiệu */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() data: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refresh(data)
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@CurrentUser('sub') userId: string): Promise<void> {
    return this.authService.logout(userId)
  }
}
