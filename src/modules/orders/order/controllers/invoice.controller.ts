import { Controller, Get, Inject, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Positions } from 'src/common/decorators/roles.decorator'
import { Position } from 'src/common/enums/role.enum'
import { IInvoiceService } from '../services/invoice.service.interface'
import { GetInvoicesQueryDto } from '../domain/dtos/get-invoives-query.dto'

@ApiTags('Invoices')
@Positions(Position.SALES)
@Controller('invoices')
export class InvoiceController {
  constructor(
    @Inject('IInvoiceService')
    private readonly invoiceService: IInvoiceService
  ) {}

  @Get('')
  async getAll(@Query() query: GetInvoicesQueryDto) {
    if (query.orderId) {
      return await this.invoiceService.getOneByOrderId(query.orderId)
    }
    return await this.invoiceService.getAllWithPagination(query)
  }

  @Get(':id')
  async getOneById(@Param('id') id: number) {
    return await this.invoiceService.getOneById(id)
  }
}
