import { ProductDto } from 'src/modules/products/product/backup/product-dto/product.dto';
import { CartDto } from './cart.dto';

export class CartDetailDto {
  cart_id: number;
  product_id: number;
  quantity: number;
  product: ProductDto;
  cart: CartDto;
}
