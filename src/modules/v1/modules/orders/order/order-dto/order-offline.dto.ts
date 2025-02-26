import { GetProductForOrderDto } from "src/modules/v1/products/product/product-dto/get-product-order.dto";

export class OrderOfflineDto {
  contact: string; // user_id
  delivery_address: string; 
  discount_id: number;
  order_detail: GetProductForOrderDto[];
  employee_id: string;
  shipping_id: string;
}

