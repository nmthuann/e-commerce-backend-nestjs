// discount.dto.ts

import { Expose } from 'class-transformer';
import { IsEmpty } from 'class-validator';

export class DiscountDto {
  @Expose()
  discount_id: number;

  @IsEmpty()
  description: string;
  expired: Date;
  percent: number;
}
