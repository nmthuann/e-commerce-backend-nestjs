import { ProductDto } from 'src/modules/v1/products/product/product.dto';
import { CartDto } from './cart.dto';

export class CartDetailDto {
  cart_id: number;
  product_id: number;
  quantity: number;
  product: ProductDto;
  cart: CartDto;
}
