import { Expose } from "class-transformer";

export class ShippingDto {

  @Expose()
  shipping_id: number;

  shipping_name: string;

  estimated_time: number;

  ship_cost: number;
}
