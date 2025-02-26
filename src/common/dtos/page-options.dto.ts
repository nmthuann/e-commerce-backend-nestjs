import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";
import { OrderBy } from "src/constants/order-by.enum";

export class PageOptionsDto {
  readonly order!: OrderBy;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  readonly take: number = 5;
  
  get skip(): number {
    return (this.page - 1) * this.take;
  }
}


// readonly q?: string;

  // page: number = 1;

  // @IsOptional()
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  // limit: number = 10;