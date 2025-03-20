import { Inject, Injectable, NotFoundException } from '@nestjs/common'
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
import { PageMetaDto } from 'src/common/dtos/page-meta.dto'
import { IUserService } from 'src/modules/users/services/user.service.interface'

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailRepository: Repository<OrderDetailEntity>,
    @Inject('IUserService')
    private readonly userService: IUserService
  ) {}

  async getAllWithPagination(query: GetOrdersQueryDto): Promise<PageDto<OrderResponse>> {
    const { userId, employeeId, status, order, page, take } = query

    const queryBuilder = this.orderRepository
      .createQueryBuilder('o') // Đổi alias từ 'order' thành 'o'
      .leftJoinAndSelect('o.user', 'user')
      .leftJoinAndSelect('o.employee', 'employee')
      .select([
        'o.id',
        'user.id',
        'employee.id',
        'o.status',
        'o.orderType',
        'o.shippingAddress',
        'o.contactPhone',
        'o.shippingMethod',
        'o.paymentMethod',
        'o.note',
        'o.createdAt',
        'o.updatedAt',
        'o.shippingFee',
        'o.discount',
        'o.postcode'
      ])

    if (employeeId) {
      queryBuilder.andWhere('employee.id = :employeeId', { employeeId })
    }

    if (userId) {
      queryBuilder.andWhere('user.id = :userId', { userId })
    }

    if (status) {
      queryBuilder.andWhere('o.status::TEXT ILIKE :status', { status: `%${status}%` })
    }

    queryBuilder.orderBy('o.createdAt', order || 'ASC')
    const [rawOrders, itemCount] = await queryBuilder
      .offset((page - 1) * take)
      .limit(take)
      .getManyAndCount()

    if (rawOrders.length === 0) {
      return new PageDto([], new PageMetaDto({ pageOptionsDto: query, itemCount: 0 }))
    }

    const res: OrderResponse[] = rawOrders.map(order => ({
      id: order.id,
      userId: order.user.id,
      employeeId: order.employee.id,
      status: order.status,
      orderType: order.orderType, //1: ON, 0: OFF
      shippingAddress: order.shippingAddress,
      contactPhone: order.contactPhone,
      shippingMethod: order.shippingMethod,
      paymentMethod: order.paymentMethod,
      note: order.note,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      shippingFee: order.shippingFee,
      discount: order.discount,
      postcode: order.postcode
    }))

    const pageMeta = new PageMetaDto({ pageOptionsDto: query, itemCount })
    return new PageDto(res, pageMeta)
  }

  async getOneById(id: number): Promise<OrderDto> {
    const findOrder = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderDetails', 'orderDetails.productSerial', 'employee', 'user']
    })
    if (!findOrder) {
      throw new NotFoundException(`Order with id "${id}" not found`)
    }
    return {
      id: findOrder.id,
      employee: await this.userService.getUserByEmployeeId(findOrder.employee.id),
      user: await this.userService.getOneById(findOrder.user.id),
      status: findOrder.status,
      orderType: findOrder.orderType,
      shippingAddress: findOrder.shippingAddress,
      contactPhone: findOrder.contactPhone,
      shippingMethod: findOrder.shippingMethod,
      paymentMethod: findOrder.paymentMethod,
      note: findOrder.note,
      createdAt: findOrder.createdAt,
      updatedAt: findOrder.updatedAt,
      shippingFee: findOrder.shippingFee,
      discount: findOrder.discount,
      postcode: findOrder.postcode,
      orderDetails: findOrder.orderDetails.map(detail => ({
        productSerial: {
          id: detail.productSerial.id,
          serialNumber: detail.productSerial.serialNumber,
          dateManufactured: detail.productSerial.dateManufactured
        },
        unitPrice: detail.unitPrice,
        tax: detail.tax
      }))
    }
  }
  createOne(data: CreateOrderDto): Promise<OrderDto> {
    throw new Error('Method not implemented.')
  }
  createOrderDetailById(id: number, data: CreateOrderDetailDto): Promise<OrderDto> {
    throw new Error('Method not implemented.')
  }
}
