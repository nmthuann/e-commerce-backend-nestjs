import { Controller, Inject } from '@nestjs/common'
import { IWarrantyService } from '../services/warranty.service.interface'

@Controller('warranties')
export class WarrantyController {
  constructor(
    @Inject('IWarrantyService')
    private readonly warrantyService: IWarrantyService
  ) {}
}
