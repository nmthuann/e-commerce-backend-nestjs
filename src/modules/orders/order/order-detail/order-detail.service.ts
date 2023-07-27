import { Injectable } from "@nestjs/common";
import { BaseService } from "src/modules/bases/base.abstract";
import { OrderDetailDto } from "../order-dto/order-detail.dto";
import { IOrderDetailService } from "./order-detail.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderDetailEntity } from "../order-detail.entity";
import { Repository } from "typeorm";

@Injectable()
export class OrderDetailService extends BaseService<OrderDetailDto> implements IOrderDetailService{
    constructor(
    @InjectRepository(OrderDetailEntity) 
    private orderDetailRepository: Repository<OrderDetailDto>) {
        super(orderDetailRepository);
    }
}