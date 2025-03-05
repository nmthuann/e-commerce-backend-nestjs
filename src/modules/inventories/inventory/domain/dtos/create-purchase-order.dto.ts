import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsInt, IsNotEmpty } from 'class-validator'

export class CreatePurchaseOrderDto {
  @ApiProperty({ example: 1, description: 'ID của nhà cung cấp' })
  @IsInt({ message: 'supplierId phải là số nguyên' })
  @IsNotEmpty({ message: 'supplierId không được để trống' })
  supplierId: number

  @ApiProperty({ example: '2025-03-05T12:00:00.000Z', description: 'Ngày đặt hàng (ISO 8601)' })
  @IsDate({ message: 'orderDate phải là ngày hợp lệ' })
  @Type(() => Date) // Chuyển đổi chuỗi sang Date khi nhận request
  @IsNotEmpty({ message: 'orderDate không được để trống' })
  orderDate: Date
}
