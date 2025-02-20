import { IBaseService } from '../../../common/bases/base.interface';
import { DiscountEntity } from './discount.entity';

export interface IDiscountService extends IBaseService<DiscountEntity> {
  checkDiscountCode(data: number): Promise<DiscountEntity>;
}
