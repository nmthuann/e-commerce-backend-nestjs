import { ProductDto } from 'src/modules/products/product/product-dto/product.dto';
import { OrderDto } from './order.dto';

export class OrderDetailDto {
  order_id: number;
  product_id: number;
  quantity: number;
  product: ProductDto; //  ???
  order: OrderDto;
}
