import { IBaseService } from "src/modules/bases/base.interface";
import { OrderDetailDto } from "../order-dto/order-detail.dto";

export interface IOrderDetailService extends IBaseService<OrderDetailDto> {
}