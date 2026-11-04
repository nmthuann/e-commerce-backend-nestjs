import { Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { PageOptionsDto } from 'src/common/dto/page-options.dto'

export class GetInvoicesQueryDto extends PageOptionsDto {
  @IsOptional()
  @Type(() => Number)
  employeeId?: number

  @IsOptional()
  @Type(() => Number)
  orderId?: number
}
