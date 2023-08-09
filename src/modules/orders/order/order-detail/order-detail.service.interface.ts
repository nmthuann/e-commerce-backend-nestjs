import { IBaseService } from "src/modules/bases/base.interface";
import { OrderDetailDto } from "../order-dto/order-detail.dto";
import { OrderDetailEntity } from "../order-detail.entity";

export interface IOrderDetailService extends IBaseService<OrderDetailEntity> {
    createMany(data: OrderDetailEntity[]):Promise<OrderDetailEntity[]>;
    findOrderDetailByOrderId(order_id: number):Promise<OrderDetailEntity []>;
    getTotalPriceByOrderId(order_id: number): Promise<number>;
    countProductSold(order_id: number): Promise<number>;
}