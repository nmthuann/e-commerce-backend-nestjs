import { Controller, Get, Inject, Param } from '@nestjs/common'
import { IInvoiceService } from '../services/invoice.service.interface'

@Controller('invoices')
export class InvoiceController {
  constructor(
    @Inject('IInvoiceService')
    private readonly invoiceService: IInvoiceService
  ) {}

  @Get(':id')
  async getOneById(@Param('id') id: number) {
    return await this.invoiceService.getOneById(id)
  }
}
