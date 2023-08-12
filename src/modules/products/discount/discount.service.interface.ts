import { IBaseService } from "../../bases/base.interface";
import { DiscountDto } from "./discount-dto/discount.dto";
import { DiscountEntity } from "./discount.entity";

export interface IDiscountService extends IBaseService<DiscountEntity>{
    checkDiscountCode(data: number): Promise<DiscountEntity>;  
}