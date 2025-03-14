import { PageDto } from 'src/common/dtos/page.dto'
import { CreatePurchaseOrderDetailDto } from '../domain/dtos/create-purchase-order-detail.dto'
import { CreatePurchaseOrderDto } from '../domain/dtos/create-purchase-order.dto'
import { GetPurchaseOrdersQueryDto } from '../domain/dtos/get-purchase-orders-query.dto'
import { PurchaseOrderDto } from '../domain/dtos/purchase-order.dto'
import { PurchaseOrderResponse } from '../domain/dtos/purchase-order.response'

export interface IPurchaseOrderService {
  getOneById(id: number): Promise<PurchaseOrderDto>
  getOneByOrderNumber(orderNumber: string): Promise<PurchaseOrderDto>
  getAllWithPagination(query: GetPurchaseOrdersQueryDto): Promise<PageDto<PurchaseOrderResponse>>
  createOne(userId: string, data: CreatePurchaseOrderDto): Promise<PurchaseOrderDto>
  createPurchaseOrderDetailById(id: number, data: CreatePurchaseOrderDetailDto): Promise<PurchaseOrderDto>
}
