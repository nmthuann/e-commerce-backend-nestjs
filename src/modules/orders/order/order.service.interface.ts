import { IBaseService } from "src/modules/bases/base.interface";
import { OrderDto } from "./order-dto/order.dto";
import { OrderEntity } from "./order.entity";
import { CreateOrderDto } from "./order-dto/create-order.dto";
import { Tokens } from "src/modules/bases/types/token.type";
import { GetTaskOrdersDto } from "./order-dto/get-task-orders.dto";

export interface IOrderService extends IBaseService<OrderEntity> {
    createNewOrder(data: CreateOrderDto):Promise<OrderEntity>;
    getTaskOrders():Promise<GetTaskOrdersDto[]>
}