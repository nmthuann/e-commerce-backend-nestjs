import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsPositive } from 'class-validator'

export class CreatePurchaseOrderDetailDto {
  @ApiProperty({ description: 'ID của SKU', example: 123 })
  @IsInt({ message: 'skuId phải là số nguyên' })
  @Type(() => Number)
  skuId: number

  @ApiProperty({ description: 'Số lượng sản phẩm', example: 10 })
  @IsInt({ message: 'quantity phải là số nguyên' })
  @IsPositive({ message: 'quantity phải lớn hơn 0' })
  @Type(() => Number)
  quantity: number

  @ApiProperty({ description: 'Đơn giá sản phẩm', example: 10000 })
  @IsInt({ message: 'unitPrice phải là số nguyên' })
  @IsPositive({ message: 'unitPrice phải lớn hơn 0' })
  @Type(() => Number)
  unitPrice: number
}
