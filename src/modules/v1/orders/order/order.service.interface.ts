import { IBaseService } from 'src/modules/v1/bases/base.interface';
import {  RevenueByMonth } from './order-dto/order.dto';
import { OrderEntity } from './order.entity';
import { GetTaskOrdersDto } from './order-dto/get-task-orders.dto';
import { OrderOfflineDto } from './order-dto/order-offline.dto';
import { GetCustomerListDto } from '../../users/user/user-dto/get-customer-list.dto';

export interface IOrderService extends IBaseService<OrderEntity> {
  getTaskOrders(): Promise<GetTaskOrdersDto[]>;
  getCountOrdersByUserId(user_id: number): Promise<number>;
  getTotalPriceOfUser(user_id: number): Promise<number>;
  getCustomerList(): Promise<GetCustomerListDto[]>;
  getCountOrderCanceledByUserId(user_id: number): Promise<number>;
  getTotalRevenue(): Promise<number>;
  getCountProductSold(): Promise<number>;
  getOrdersHasCompletedStatus(): Promise<OrderEntity[]>;
  getOrdersHasCompletedStatusInThisYear(year: number): Promise<OrderEntity[]>;
  getRevenueByMonth(): Promise<RevenueByMonth>;
  getTotalPriceByOrderId(order_id: number): Promise<number>;
  createOrderOnline(
    customer: string,
    productIds: number[],
  ): Promise<OrderEntity>;
  createNewOrderOffline(data: OrderOfflineDto): Promise<OrderEntity>; //email: string,
  updateStatusOrder(order_id: number, status: string): Promise<OrderEntity | object >;
  handleCanceledOrder(order_id: number, employee_email: string); // order: OrderEntity, status: string
  handleConfirmedOrder(order_id: number, employee_email: string);
  handleInProgressOrder(order_id: number);
  handleCompletedOrder(order_id: number);
  handleRefundedOrder(order_id: number);
  statisticalOnOffOrderCount(): Promise<any>;
  getMonthName(month: number): string ;
  statisticalCategoryByOrder(): Promise<any>;
  findTopUserBuyProduct(top: number): Promise<any>;
}
