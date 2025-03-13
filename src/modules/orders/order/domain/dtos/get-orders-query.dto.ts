import { Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { PageOptionsDto } from 'src/common/dtos/page-options.dto'
import { OrderStatus } from 'src/constants/order-status.enum'

export class GetOrdersQueryDto extends PageOptionsDto {
  @IsOptional()
  @Type(() => String)
  status?: OrderStatus

  @IsOptional()
  @Type(() => Number)
  employeeId?: number

  @IsOptional()
  @Type(() => String)
  userId?: string
}
