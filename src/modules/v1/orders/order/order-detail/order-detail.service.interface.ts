import { IBaseService } from 'src/modules/v1/bases/base.interface';
import { OrderDetailEntity } from '../order-detail.entity';

export interface IOrderDetailService extends IBaseService<OrderDetailEntity> {
  createMany(data: OrderDetailEntity[]): Promise<OrderDetailEntity[]>;
  findOrderDetailByOrderId(order_id: number): Promise<OrderDetailEntity[]>;
  getTotalPriceByOrderId(order_id: number): Promise<number>;
  countProductSold(order_id: number): Promise<number>;
  updateQuantityProduct(order_id):Promise<void>;
}
