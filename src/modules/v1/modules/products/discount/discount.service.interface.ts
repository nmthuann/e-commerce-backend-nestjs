import { IBaseService } from 'src/modules/v1/bases/base.interface'
import { DiscountEntity } from './discount.entity'

export interface IDiscountService extends IBaseService<DiscountEntity> {
  checkDiscountCode(data: number): Promise<DiscountEntity>
}
