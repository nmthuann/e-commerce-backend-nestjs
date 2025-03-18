import { PageDto } from 'src/common/dtos/page.dto'
import { CreateInvoiceDto } from '../domain/dtos/create-invoice.dto'
import { GetInvoicesQueryDto } from '../domain/dtos/get-invoives-query.dto'
import { InvoiceDto } from '../domain/dtos/invoice.dto'
import { InvoiceResponse } from '../domain/dtos/invoice.response'

export interface IInvoiceService {
  getOneById(id: number): Promise<InvoiceDto>
  getOneByOrderId(orderId: number): Promise<InvoiceDto>
  getAllWithPagination(query: GetInvoicesQueryDto): Promise<PageDto<InvoiceResponse>>
  createOne(data: CreateInvoiceDto): Promise<InvoiceDto>
}
