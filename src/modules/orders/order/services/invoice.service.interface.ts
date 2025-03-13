import { CreateInvoiceDto } from '../domain/dtos/create-invoice.dto'
import { InvoiceDto } from '../domain/dtos/invoice.dto'

export interface IInvoiceService {
  getOneById(id: number): Promise<InvoiceDto>
  createOne(data: CreateInvoiceDto): Promise<InvoiceDto>
}
