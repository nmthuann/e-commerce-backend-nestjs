import { Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength
} from 'class-validator'
import { PageOptionsDto } from 'src/common/dto/page-options.dto'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from 'src/common/utils/password.util'
import { PHONE_PATTERN } from '../users/user.dto'

const toBoolean = ({ value }: { value: unknown }) => (value === 'true' ? true : value === 'false' ? false : value)

export class CreateEmployeeDto {
  @IsEmail()
  email: string

  /** Mật khẩu đăng nhập ban đầu của nhân viên */
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

  @IsInt()
  positionId: number

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salary: number

  /** Ngày vào làm (YYYY-MM-DD), mặc định hôm nay */
  @IsOptional()
  @IsDateString({ strict: true })
  hiredAt?: string
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsInt()
  positionId?: number

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salary?: number

  /** false = nghỉ việc: tài khoản chuyển INACTIVE và bị thu hồi refresh token */
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class GetEmployeesQueryDto extends PageOptionsDto {
  /** Tìm theo email, họ tên hoặc số điện thoại */
  @IsOptional()
  @IsString()
  q?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  positionId?: number

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isActive?: boolean
}
