import { IBaseService } from "src/modules/bases/base.interface";
import { CartDetailDto } from "../cart-dto/cart-detail.dto";

export interface ICartDetailService extends IBaseService<CartDetailDto> {
}