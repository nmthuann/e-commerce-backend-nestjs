import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class SupplierDto {
  @ApiProperty({ description: 'ID của nhà cung cấp', example: 1 })
  @IsInt()
  readonly id: number

  @ApiProperty({ description: 'Tên nhà cung cấp', example: 'Công ty TNHH ABC' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string

  @ApiPropertyOptional({ description: 'Địa chỉ nhà cung cấp', example: '123 Đường XYZ, Quận 1, TP.HCM' })
  @IsString()
  @IsOptional()
  readonly address?: string

  @ApiPropertyOptional({ description: 'Số điện thoại nhà cung cấp', example: '0123456789' })
  @IsString()
  @IsOptional()
  @MaxLength(15)
  readonly phone?: string

  @ApiPropertyOptional({ description: 'Email nhà cung cấp', example: 'contact@abc.com' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  readonly email?: string

  constructor(supplier: Partial<SupplierDto>) {
    if (!supplier) throw new Error('Invalid Supplier data')
    Object.assign(this, supplier)
  }
}
