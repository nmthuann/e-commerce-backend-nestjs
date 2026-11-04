import { IsEnum, IsOptional, IsString, IsUrl, Length, Matches, MaxLength, MinLength } from 'class-validator'
import { PageOptionsDto } from 'src/common/dto/page-options.dto'
import { Role } from 'src/common/enums/role.enum'
import { UserStatus } from 'src/common/enums/user-status.enum'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from 'src/common/utils/password.util'
import { UserEntity } from './user.entity'

// Số điện thoại Việt Nam: 10 số, bắt đầu bằng 0
export const PHONE_PATTERN = /^0\d{9}$/

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  fullName?: string

  @IsOptional()
  @Matches(PHONE_PATTERN, { message: 'phone phải gồm 10 chữ số và bắt đầu bằng 0' })
  phone?: string

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  avatarUrl?: string
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  newPassword: string
}

export class GetUsersQueryDto extends PageOptionsDto {
  /** Tìm theo email, họ tên hoặc số điện thoại */
  @IsOptional()
  @IsString()
  q?: string

  @IsOptional()
  @IsEnum(Role)
  role?: Role

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus
}

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  status: UserStatus
}

// Thông tin người dùng rút gọn để nhúng vào dữ liệu module khác (đơn hàng, phiếu nhập…)
export class PublicUserDto {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
}

export const toPublicUser = (user?: UserEntity | null): PublicUserDto | null =>
  user ? { id: user.id, email: user.email, fullName: user.fullName, avatarUrl: user.avatarUrl } : null
