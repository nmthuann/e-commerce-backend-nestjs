import { OrderBy } from "src/constants/order-by.enum";

export class PageOptionsDto {
  readonly order!: OrderBy;
  readonly page!: number;
  readonly take!: number;
  get skip(): number {
    return (this.page - 1) * this.take;
  }
  readonly q?: string;
}