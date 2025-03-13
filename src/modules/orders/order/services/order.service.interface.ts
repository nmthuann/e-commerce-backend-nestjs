import { PageDto } from 'src/common/dtos/page.dto'
import { GetOrdersQueryDto } from '../domain/dtos/get-orders-query.dto'
import { OrderDto } from '../domain/dtos/order.dto'
import { OrderResponse } from '../domain/dtos/order.response'
import { CreateOrderDto } from '../domain/dtos/create-order.dto'
import { CreateOrderDetailDto } from '../domain/dtos/create-order-detail.dto'

export interface IOrderService {
  getAllWithPagination(query: GetOrdersQueryDto): Promise<PageDto<OrderResponse>>
  getOneById(id: number): Promise<OrderDto>
  createOne(data: CreateOrderDto): Promise<OrderDto>
  createOrderDetailById(id: number, data: CreateOrderDetailDto): Promise<OrderDto>
}
