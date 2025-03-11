import { Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { PageOptionsDto } from 'src/common/dtos/page-options.dto'

export class GetProductSerialsQueryDto extends PageOptionsDto {
  @IsOptional()
  @Type(() => Number)
  warehouseReceiptId?: number

  @IsOptional()
  @Type(() => Number)
  productSkuId?: number

  @IsOptional()
  @Type(() => Boolean)
  isGetStock?: boolean
}
