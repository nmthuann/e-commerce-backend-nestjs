import { Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { PageOptionsDto } from 'src/common/dtos/page-options.dto'

export class GetWarehouseReceiptsQueryDto extends PageOptionsDto {
  @IsOptional()
  @Type(() => Date)
  receiptDate?: Date

  @IsOptional()
  @Type(() => String)
  receiptNumber?: string
}
