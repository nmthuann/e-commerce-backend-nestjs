import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { WarehouseReceiptEntity } from '../../domain/entities/warehouse-receipt.entity'
import { IWarehouseReceiptService } from '../warehouse-receipt.service.interface'
import { ProductSerialEntity } from '../../domain/entities/product-serial.entity'
import { CreateProductSerialDto } from '../../domain/dtos/create-product-serial.dto'
import { CreateWarehouseReceiptDto } from '../../domain/dtos/create-warehouse-receipt.dto'
import { WarehouseReceiptDto } from '../../domain/dtos/warehouse-receipt.dto'
import { IEmployeeService } from 'src/modules/users/services/employee.service.interface'
import { WarehouseReceiptQueryType } from '../../domain/types/warehouse-receipt-query.type'
import { GetWarehouseReceiptsQueryDto } from '../../domain/dtos/get-warehouse-receupot-query.dto'
import { PageDto } from 'src/common/dtos/page.dto'
import { WarehouseReceiptResponse } from '../../domain/dtos/warehouse-receipt.response'
import { PageMetaDto } from 'src/common/dtos/page-meta.dto'

@Injectable()
export class WarehouseReceiptService implements IWarehouseReceiptService {
  constructor(
    @InjectRepository(WarehouseReceiptEntity)
    private readonly warehouseReceiptRepository: Repository<WarehouseReceiptEntity>,
    @InjectRepository(ProductSerialEntity)
    private readonly productSerialRepository: Repository<WarehouseReceiptEntity>,
    @Inject('IEmployeeService')
    private readonly employeeService: IEmployeeService
  ) {}

  async getOneById(id: number): Promise<WarehouseReceiptDto> {
    const findWarehouseReceipt = await this.warehouseReceiptRepository.findOne({
      where: { id },
      relations: ['purchaseOrder', 'employee', 'productSerials']
    })
    if (!findWarehouseReceipt) {
      throw new NotFoundException('Purchase Order Not Found')
    }
    return {
      id: findWarehouseReceipt.id,
      receiptNumber: findWarehouseReceipt.receiptNumber,
      purchaseOrderId: findWarehouseReceipt.purchaseOrder.id,
      receiptDate: findWarehouseReceipt.receiptDate,
      employeeId: findWarehouseReceipt.employee.id,
      createdAt: findWarehouseReceipt.createdAt,
      productSerials: findWarehouseReceipt.productSerials.map(dto => ({
        id: dto.id,
        serialNumber: dto.serialNumber,
        dateManufactured: dto.dateManufactured
      }))
    }
  }

  async createOne(userId: string, data: CreateWarehouseReceiptDto): Promise<WarehouseReceiptDto> {
    const getEmployee = await this.employeeService.getOneByUserId(userId)
    const today = new Date().toISOString().slice(0, 10)
    const orderCount = await this.warehouseReceiptRepository
      .createQueryBuilder('po')
      .where('DATE(po.orderDate) = :today', { today })
      .getCount()

    const receiptNumber = `WHR-${today.replace(/-/g, '')}-${String(orderCount + 1).padStart(5, '0')}`

    const queryBuilder = await this.warehouseReceiptRepository
      .createQueryBuilder()
      .insert()
      .into(WarehouseReceiptEntity)
      .values({
        receiptNumber: receiptNumber,
        purchaseOrder: { id: data.purchaseOrderId },
        employee: { id: getEmployee.id },
        receiptDate: data.receiptDate
      })
      .returning('*')
      .execute()
    const recordCreated: WarehouseReceiptQueryType = queryBuilder.raw[0]
    console.log('recordCreated:::', recordCreated)
    return {
      id: recordCreated.id,
      receiptNumber: recordCreated.receipt_number,
      purchaseOrderId: recordCreated.purchase_order_id,
      employeeId: recordCreated.employee_id,
      receiptDate: recordCreated.receipt_date,
      createdAt: recordCreated.created_at,
      productSerials: []
    }
  }

  async createProductSerialById(id: number, data: CreateProductSerialDto): Promise<WarehouseReceiptDto> {
    const queryBuilder = await this.productSerialRepository
      .createQueryBuilder()
      .insert()
      .into(ProductSerialEntity)
      .values({
        serialNumber: data.serialNumber,
        dateManufactured: data.dateManufactured,
        productSku: { id: data.productSkuId },
        warehouseReceipt: { id: id }
      })
      .returning('*')
      .execute()
    const recordCreated = queryBuilder.raw[0]
    console.log(recordCreated)
    return await this.getOneById(id)
  }

  async getAllWithPagination(query: GetWarehouseReceiptsQueryDto): Promise<PageDto<WarehouseReceiptResponse>> {
    const whereCondition = query.receiptDate ? { receiptDate: query.receiptDate } : {}

    const [data, total] = await this.warehouseReceiptRepository.findAndCount({
      where: whereCondition,
      relations: ['purchaseOrder', 'employee'],
      order: {
        id: query.order || 'ASC'
      },
      skip: query.skip,
      take: query.take
    })

    console.log('data', Math.ceil(total / query.take))
    const pageMeta = new PageMetaDto({ pageOptionsDto: query, itemCount: total })
    const res: WarehouseReceiptResponse[] = data.map(response => ({
      id: response.id,
      purchaseOrder: {
        id: response.purchaseOrder.id,
        orderNumber: response.purchaseOrder.orderNumber,
        orderDate: response.purchaseOrder.orderDate,
        createdAt: response.purchaseOrder.createdAt
      },
      employeeId: response.employee.id,
      receiptDate: response.receiptDate,
      receiptNumber: response.receiptNumber,
      createdAt: response.createdAt
    }))
    return new PageDto(res, pageMeta)
  }

  async getOneByReceiptNumber(receiptNumber: string): Promise<WarehouseReceiptDto> {
    const findWarehouseReceipt = await this.warehouseReceiptRepository.findOne({
      where: { receiptNumber: receiptNumber },
      relations: ['purchaseOrder', 'employee', 'productSerials']
    })
    if (!findWarehouseReceipt) {
      throw new NotFoundException('Warehouse Receipt Not Found')
    }
    return {
      id: findWarehouseReceipt.id,
      receiptNumber: findWarehouseReceipt.receiptNumber,
      purchaseOrderId: findWarehouseReceipt.purchaseOrder.id,
      employeeId: findWarehouseReceipt.employee.id,
      receiptDate: findWarehouseReceipt.receiptDate,
      createdAt: findWarehouseReceipt.createdAt,
      productSerials: findWarehouseReceipt.productSerials.map(dto => ({
        id: dto.id,
        serialNumber: dto.serialNumber,
        dateManufactured: dto.dateManufactured
      }))
    }
  }
}
