import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { OrderEntity } from '../../domain/entities/order.entity'
import { Repository } from 'typeorm'
import { IOrderService } from '../order.service.interface'
import { OrderDetailEntity } from '../../domain/entities/order-detail.entity'
import { PageDto } from 'src/common/dtos/page.dto'
import { CreateOrderDetailDto } from '../../domain/dtos/create-order-detail.dto'
import { CreateOrderDto } from '../../domain/dtos/create-order.dto'
import { GetOrdersQueryDto } from '../../domain/dtos/get-orders-query.dto'
import { OrderDto } from '../../domain/dtos/order.dto'
import { OrderResponse } from '../../domain/dtos/order.response'

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailRepository: Repository<OrderDetailEntity>
  ) {}

  getAllWithPagination(query: GetOrdersQueryDto): Promise<PageDto<OrderResponse>> {
    throw new Error('Method not implemented.')
  }
  getOneById(id: number): Promise<OrderDto> {
    throw new Error('Method not implemented.')
  }
  createOne(data: CreateOrderDto): Promise<OrderDto> {
    throw new Error('Method not implemented.')
  }
  createOrderDetailById(id: number, data: CreateOrderDetailDto): Promise<OrderDto> {
    throw new Error('Method not implemented.')
  }
}
