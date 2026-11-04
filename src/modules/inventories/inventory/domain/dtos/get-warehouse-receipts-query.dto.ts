import { Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { PageOptionsDto } from 'src/common/dto/page-options.dto'

export class GetWarehouseReceiptsQueryDto extends PageOptionsDto {
  @IsOptional()
  @Type(() => Date)
  receiptDate?: Date

  @IsOptional()
  @Type(() => String)
  receiptNumber?: string
}
