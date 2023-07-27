import { IBaseService } from "src/modules/bases/base.interface";
import { OrderDto } from "./order-dto/order.dto";

export interface IOrderService extends IBaseService<OrderDto> {
}