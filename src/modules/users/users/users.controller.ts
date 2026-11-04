import { Body, Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { ChangePasswordDto, UpdateProfileDto } from './user.dto'
import { UserEntity } from './user.entity'
import { UsersService } from './users.service'

// Mọi người dùng đã đăng nhập (CUSTOMER, STAFF, ADMIN)
@ApiTags('Users')
@Controller('users/me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** Hồ sơ của tôi (nhân viên có kèm employee + position) */
  @Get()
  getProfile(@CurrentUser('sub') userId: string): Promise<UserEntity> {
    return this.usersService.findById(userId)
  }

  @Patch()
  updateProfile(@CurrentUser('sub') userId: string, @Body() data: UpdateProfileDto): Promise<UserEntity> {
    return this.usersService.updateProfile(userId, data)
  }

  /** Đổi mật khẩu — refresh token hiện tại bị thu hồi */
  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(@CurrentUser('sub') userId: string, @Body() data: ChangePasswordDto): Promise<void> {
    return this.usersService.changePassword(userId, data)
  }
}
