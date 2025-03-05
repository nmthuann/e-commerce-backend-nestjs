import { Inject, Injectable } from '@nestjs/common'
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

  getOneById(id: number): Promise<PurchaseOrderDto> {
    throw new Error('Method not implemented.')
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

  createPurchaseOrderDetailById(id: number, data: CreatePurchaseOrderDetailDto): Promise<PurchaseOrderDto> {
    throw new Error('Method not implemented.')
  }
}
