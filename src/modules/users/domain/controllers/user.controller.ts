import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ChangePasswordDto, UpdateProfileDto } from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';

// Mọi người dùng đã đăng nhập (CUSTOMER, STAFF, ADMIN)
@ApiTags('Users')
@Controller('users/me')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** Hồ sơ của tôi (nhân viên có kèm employee + position) */
  @Get()
  getProfile(@CurrentUser('sub') userId: string): Promise<UserEntity> {
    return this.userService.findById(userId);
  }

  @Patch()
  updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() data: UpdateProfileDto,
  ): Promise<UserEntity> {
    return this.userService.updateProfile(userId, data);
  }

  /** Đổi mật khẩu — refresh token hiện tại bị thu hồi */
  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(
    @CurrentUser('sub') userId: string,
    @Body() data: ChangePasswordDto,
  ): Promise<void> {
    return this.userService.changePassword(userId, data);
  }
}
