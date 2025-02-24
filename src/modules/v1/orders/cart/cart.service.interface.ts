import { IBaseService } from 'src/modules/v1/bases/base.interface';
import { CartDto } from './cart-dto/cart.dto';

export type ICartService = IBaseService<CartDto>;
