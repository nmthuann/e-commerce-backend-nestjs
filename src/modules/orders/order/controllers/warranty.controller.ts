import { Controller, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Positions } from 'src/common/decorators/roles.decorator'
import { Position } from 'src/common/enums/role.enum'
import { IWarrantyService } from '../services/warranty.service.interface'

// TODO(P5.11–P5.12): API phiếu bảo hành và tiếp nhận bảo hành
@ApiTags('Warranties')
@Positions(Position.SALES)
@Controller('warranties')
export class WarrantyController {
  constructor(
    @Inject('IWarrantyService')
    private readonly warrantyService: IWarrantyService
  ) {}
}
