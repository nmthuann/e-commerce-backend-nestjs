import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InvoiceEntity } from '../../domain/entities/invoice.entity'
import { Repository } from 'typeorm'
import { IInvoiceService } from '../invoice.service.interface'
import { CreateInvoiceDto } from '../../domain/dtos/create-invoice.dto'
import { InvoiceDto } from '../../domain/dtos/invoice.dto'
import { PageDto } from 'src/common/dtos/page.dto'
import { GetInvoicesQueryDto } from '../../domain/dtos/get-invoives-query.dto'
import { InvoiceResponse } from '../../domain/dtos/invoice.response'

@Injectable()
export class InvoiceService implements IInvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>
  ) {}

  async getOneById(id: number): Promise<InvoiceDto> {
    const findInvoice = await this.invoiceRepository.findOne({ where: { id }, relations: ['order', 'employee'] })
    if (!findInvoice) {
      throw new NotFoundException(`Invoice with id "${id}" not found`)
    }

    return {
      id: findInvoice.id,
      invoiceCode: findInvoice.invoiceCode,
      order: findInvoice.order.id,
      employeeId: findInvoice.employee.id,
      createdAt: findInvoice.createdAt,
      taxCode: findInvoice.taxCode
    }
  }

  async getOneByOrderId(orderId: number): Promise<InvoiceDto> {
    const findInvoice = await this.invoiceRepository.findOne({
      where: { order: { id: orderId } },
      relations: ['order', 'employee']
    })
    if (!findInvoice) {
      throw new NotFoundException(`Invoice with order Id "${orderId}" not found`)
    }

    return {
      id: findInvoice.id,
      invoiceCode: findInvoice.invoiceCode,
      order: findInvoice.order.id,
      employeeId: findInvoice.employee.id,
      createdAt: findInvoice.createdAt,
      taxCode: findInvoice.taxCode
    }
  }

  getAllWithPagination(query: GetInvoicesQueryDto): Promise<PageDto<InvoiceResponse>> {
    throw new Error('Method not implemented.')
  }

  createOne(data: CreateInvoiceDto): Promise<InvoiceDto> {
    throw new Error('Method not implemented.')
  }
}
