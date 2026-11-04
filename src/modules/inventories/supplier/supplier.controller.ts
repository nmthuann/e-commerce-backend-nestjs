import { Controller, Get, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Positions } from 'src/common/decorators/roles.decorator'
import { Position } from 'src/common/enums/role.enum'
import { SupplierDto } from './supplier.dto'
import { ISupplierService } from './supplier.service.interface'

@ApiTags('Suppliers')
@Positions(Position.WAREHOUSE)
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
