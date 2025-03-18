import { Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { PageOptionsDto } from 'src/common/dtos/page-options.dto'

export class GetInvoicesQueryDto extends PageOptionsDto {
  @IsOptional()
  @Type(() => Number)
  employeeId?: number

  @IsOptional()
  @Type(() => Number)
  orderId?: number
}
