import { IBaseService } from 'src/modules/v1/bases/base.interface';
import { CartDetailDto } from '../cart-dto/cart-detail.dto';

export type ICartDetailService = IBaseService<CartDetailDto>;
