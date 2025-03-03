import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { OrderEntity } from '../../domain/entities/order.entity'
import { Repository } from 'typeorm'
import { IOrderService } from '../order.service.interface'
import { OrderDetailEntity } from '../../domain/entities/order-detail.entity'

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailRepository: Repository<OrderDetailEntity>
  ) {}
}
