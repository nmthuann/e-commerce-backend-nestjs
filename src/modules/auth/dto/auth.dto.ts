import { IsEmail, IsJWT, IsOptional, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from 'src/common/utils/password.util'
import { PHONE_PATTERN } from 'src/modules/users/users/user.dto'
import { UserEntity } from 'src/modules/users/users/user.entity'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  password: string

  @IsString()
  @Length(2, 100)
  fullName: string

  @IsOptional()
  @Matches(PHONE_PATTERN, { message: 'phone phải gồm 10 chữ số và bắt đầu bằng 0' })
  phone?: string
}

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(1)
  password: string
}

export class RefreshTokenDto {
  @IsJWT()
  refreshToken: string
}

export class AuthResponseDto {
  accessToken: string
  refreshToken: string
  user: UserEntity
}
