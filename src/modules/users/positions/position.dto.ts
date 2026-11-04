import { OmitType, PartialType } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, Length } from 'class-validator'
import { Position } from 'src/common/enums/role.enum'

export class CreatePositionDto {
  /** Mã vị trí gắn với quyền; thêm vị trí mới = thêm giá trị vào enum Position */
  @IsEnum(Position)
  code: Position

  @IsString()
  @Length(2, 100)
  name: string

  @IsOptional()
  @IsString()
  description?: string
}

// Không cho đổi code vì quyền của nhân viên phụ thuộc vào nó
export class UpdatePositionDto extends PartialType(OmitType(CreatePositionDto, ['code'] as const)) {}
