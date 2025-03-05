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
import { PurchaseOrderQueryType } from '../../domain/dtos/purchase-order-query.type'
import { mapAttributes } from 'src/utils/map'

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

  getPurchaseOrdersWithPagination(query: GetPurchaseOrdersQueryDto): Promise<PageDto<PurchaseOrderDto>> {
    throw new Error('Method not implemented.')
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
        orderDate: new Date()
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
}
