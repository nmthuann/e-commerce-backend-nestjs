import { Injectable } from "@nestjs/common";
import { BaseService } from "src/modules/bases/base.abstract";
import { OrderDto } from "./order-dto/order.dto";
import { IOrderService } from "./order.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./order.entity";
import { Repository } from "typeorm";

@Injectable()
export class OrderService extends BaseService<OrderDto> implements IOrderService{
    constructor(
    @InjectRepository(OrderEntity) 
    private orderRepository: Repository<OrderDto>) {
        super(orderRepository);
    }
}