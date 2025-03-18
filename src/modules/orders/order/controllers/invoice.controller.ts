import { Controller, Get, Inject, Param, Query } from '@nestjs/common'
import { IInvoiceService } from '../services/invoice.service.interface'
import { GetInvoicesQueryDto } from '../domain/dtos/get-invoives-query.dto'

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
