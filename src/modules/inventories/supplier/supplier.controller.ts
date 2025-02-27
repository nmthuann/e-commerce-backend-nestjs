import { Controller, Get, Inject } from '@nestjs/common'
import { SupplierDto } from './supplier.dto'
import { ISupplierService } from './supplier.service.interface'

@Controller('suppliers')
export class SupplierController {
  constructor(
    @Inject('ISupplierService')
    private readonly supplierService: ISupplierService
  ) {}

  @Get()
  async getAll(): Promise<SupplierDto[]> {
    return await this.supplierService.getAll()
  }
}
