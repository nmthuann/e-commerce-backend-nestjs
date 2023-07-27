import { IBaseService } from "src/modules/bases/base.interface";
import { CartDto } from "./cart-dto/cart.dto";



export interface ICartService extends IBaseService<CartDto> {
}