import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InvoiceEntity } from '../../domain/entities/invoice.entity'
import { Repository } from 'typeorm'
import { IInvoiceService } from '../invoice.service.interface'
import { CreateInvoiceDto } from '../../domain/dtos/create-invoice.dto'
import { InvoiceDto } from '../../domain/dtos/invoice.dto'

@Injectable()
export class InvoiceService implements IInvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>
  ) {}
  getOneById(id: number): Promise<InvoiceDto> {
    throw new Error('Method not implemented.')
  }
  createOne(data: CreateInvoiceDto): Promise<InvoiceDto> {
    throw new Error('Method not implemented.')
  }
}
