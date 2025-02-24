import { IBaseService } from 'src/common/bases/base.interface';
import { CartDto } from './cart-dto/cart.dto';

export type ICartService = IBaseService<CartDto>;
