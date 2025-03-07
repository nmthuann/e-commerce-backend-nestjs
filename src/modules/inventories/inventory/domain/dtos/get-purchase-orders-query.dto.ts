import { Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { PageOptionsDto } from 'src/common/dtos/page-options.dto'

export class GetPurchaseOrdersQueryDto extends PageOptionsDto {
  @IsOptional()
  @Type(() => Date)
  orderDate?: Date

  @IsOptional()
  @Type(() => String)
  orderNumber?: string
}
