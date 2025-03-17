import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PurchaseOrderEntity } from '../../domain/entities/purchase-order.entity'
import { PurchaseOrderDetailEntity } from '../../domain/entities/purchase-order-detail.entity'
import { IPurchaseOrderService } from '../purchase-order.service.interface'
import { PageDto } from 'src/common/dtos/page.dto'
import { CreatePurchaseOrderDetailDto } from '../../domain/dtos/create-purchase-order-detail.dto'
import { CreatePurchaseOrderDto } from '../../domain/dtos/create-purchase-order.dto'
import { GetPurchaseOrdersQueryDto } from '../../domain/dtos/get-purchase-orders-query.dto'
import { PurchaseOrderDto } from '../../domain/dtos/purchase-order.dto'
import { IEmployeeService } from 'src/modules/users/services/employee.service.interface'
import { PurchaseOrderQueryType } from '../../domain/types/purchase-order-query.type'
import { mapAttributes } from 'src/utils/map'
import { PageMetaDto } from 'src/common/dtos/page-meta.dto'
import { PurchaseOrderResponse } from '../../domain/dtos/purchase-order.response'

@Injectable()
export class PurchaseOrderService implements IPurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrderEntity)
    private readonly purchaseOrderRepository: Repository<PurchaseOrderEntity>,
    @InjectRepository(PurchaseOrderDetailEntity)
    private readonly purchaseOrderDetailRepository: Repository<PurchaseOrderDetailEntity>,
    @Inject('IEmployeeService')
    private readonly employeeService: IEmployeeService
  ) {}

  async getOneByOrderNumber(orderNumber: string): Promise<PurchaseOrderDto> {
    const findPurchaseOrder = await this.purchaseOrderRepository.findOne({
      where: { orderNumber: orderNumber },
      relations: ['supplier', 'employee', 'purchaseOrderDetails', 'purchaseOrderDetails.sku']
    })
    if (!findPurchaseOrder) {
      throw new NotFoundException('Purchase Order Not Found')
    }
    return {
      id: findPurchaseOrder.id,
      orderNumber: findPurchaseOrder.orderNumber,
      supplierId: findPurchaseOrder.supplier.id,
      employeeId: findPurchaseOrder.employee.id,
      orderDate: findPurchaseOrder.orderDate,
      createdAt: findPurchaseOrder.createdAt,
      purchaseOrderDetails: findPurchaseOrder.purchaseOrderDetails.map(dto => ({
        sku: {
          id: dto.sku.id,
          skuNo: dto.sku.skuNo,
          barcode: dto.sku.barcode,
          skuName: dto.sku.skuName,
          image: dto.sku.image,
          status: dto.sku.status,
          skuAttributes: mapAttributes(dto.sku.skuAttributes),
          slug: dto.sku.slug
        },
        quantity: dto.quantity,
        unitPrice: dto.unitPrice
      }))
    }
  }

  async getOneById(id: number): Promise<PurchaseOrderDto> {
    const findPurchaseOrder = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: ['supplier', 'employee', 'purchaseOrderDetails', 'purchaseOrderDetails.sku']
    })
    if (!findPurchaseOrder) {
      throw new NotFoundException('Purchase Order Not Found')
    }
    return {
      id: findPurchaseOrder.id,
      orderNumber: findPurchaseOrder.orderNumber,
      supplierId: findPurchaseOrder.supplier.id,
      employeeId: findPurchaseOrder.employee.id,
      orderDate: findPurchaseOrder.orderDate,
      createdAt: findPurchaseOrder.createdAt,

      purchaseOrderDetails: findPurchaseOrder.purchaseOrderDetails.map(dto => ({
        sku: {
          id: dto.sku.id,
          skuNo: dto.sku.skuNo,
          barcode: dto.sku.barcode,
          skuName: dto.sku.skuName,
          image: dto.sku.image,
          status: dto.sku.status,
          skuAttributes: mapAttributes(dto.sku.skuAttributes),
          slug: dto.sku.slug
        },
        quantity: dto.quantity,
        unitPrice: dto.unitPrice
      }))
    }
  }

  async createOne(userId: string, data: CreatePurchaseOrderDto): Promise<PurchaseOrderDto> {
    const getEmployee = await this.employeeService.getOneByUserId(userId)
    const today = new Date().toISOString().slice(0, 10)
    const orderCount = await this.purchaseOrderRepository
      .createQueryBuilder('po')
      .where('DATE(po.orderDate) = :today', { today })
      .getCount()

    const orderNumber = `PO-${today.replace(/-/g, '')}-${String(orderCount + 1).padStart(5, '0')}`

    const queryBuilder = await this.purchaseOrderRepository
      .createQueryBuilder()
      .insert()
      .into(PurchaseOrderEntity)
      .values({
        orderNumber: orderNumber,
        supplier: { id: data.supplierId },
        employee: { id: getEmployee.id },
        orderDate: data.orderDate
      })
      .returning('*')
      .execute()
    const recordCreated: PurchaseOrderQueryType = queryBuilder.raw[0]
    console.log('recordCreated:::', recordCreated)
    return {
      id: recordCreated.id,
      orderNumber: recordCreated.order_number,
      supplierId: recordCreated.supplier_id,
      employeeId: recordCreated.employee_id,
      orderDate: recordCreated.order_date,
      createdAt: recordCreated.created_at,
      purchaseOrderDetails: []
    }
  }

  async createPurchaseOrderDetailById(id: number, data: CreatePurchaseOrderDetailDto): Promise<PurchaseOrderDto> {
    const queryBuilder = await this.purchaseOrderDetailRepository
      .createQueryBuilder()
      .insert()
      .into(PurchaseOrderDetailEntity)
      .values({
        purchaseOrder: { id: id },
        sku: { id: data.skuId },
        quantity: data.quantity,
        unitPrice: data.unitPrice
      })
      .returning('*')
      .execute()
    const recordCreated = queryBuilder.raw[0]
    console.log(recordCreated)
    return await this.getOneById(id)
  }

  async getAllWithPagination(query: GetPurchaseOrdersQueryDto): Promise<PageDto<PurchaseOrderResponse>> {
    const whereCondition = query.orderDate ? { orderDate: query.orderDate } : {}

    const [data, total] = await this.purchaseOrderRepository.findAndCount({
      where: whereCondition,
      relations: ['supplier', 'employee'],
      order: {
        id: query.order || 'ASC'
      },
      skip: query.skip,
      take: query.take
    })

    console.log('data', Math.ceil(total / query.take))
    const pageMeta = new PageMetaDto({ pageOptionsDto: query, itemCount: total })

    const res: PurchaseOrderResponse[] = data.map(response => ({
      id: response.id,
      supplierId: response.supplier.id,
      employeeId: response.employee.id,
      orderDate: response.orderDate,
      orderNumber: response.orderNumber,
      createdAt: response.createdAt
    }))

    return new PageDto(res, pageMeta)
  }
}
