
import { GetProductForOrderDto } from '../../../products/product/backup/product-dto/get-product-order.dto';

export class CreateOrderDto {
  products: GetProductForOrderDto[]; 
  shipping_id: number;
  payment_id: number;
  employee_id: string;
  user_id: number;
  discount_id: number;
}
