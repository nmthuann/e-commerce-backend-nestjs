import { IBaseService } from "src/modules/bases/base.interface";
import { OrderDto, RevenueByMonth } from "./order-dto/order.dto";
import { OrderEntity } from "./order.entity";
import { CreateOrderDto } from "./order-dto/create-order.dto";
import { Tokens } from "src/modules/bases/types/token.type";
import { GetTaskOrdersDto } from "./order-dto/get-task-orders.dto";
import { GetCustomerListDto } from "src/modules/users/user/user-dto/get-customer-list.dto";
import { OrderOnlineDto } from "./order-dto/order-online.dto";
import { OrderOfflineDto } from "./order-dto/order-offline.dto";
// import { GraphData } from "./order.service";

export interface IOrderService extends IBaseService<OrderEntity> {
    getTaskOrders():Promise<GetTaskOrdersDto[]>;
    getCountOrdersByUserId(user_id: number): Promise<number>;
    getTotalPriceOfUser(user_id: number): Promise<number>;
    getCustomerList():Promise<GetCustomerListDto[]>;
    getCountOrderCanceledByUserId(user_id: number): Promise<number>;
    getTotalRevenue():Promise<number>;
    getCountProductSold():Promise<number>;
    getOrdersHasCompletedStatus():Promise<OrderEntity[]>;
    getRevenueByMonth(): Promise<RevenueByMonth>;
    createNewOrderOnline(data: OrderOnlineDto, productIds: number[]): Promise<OrderEntity>;
    createNewOrderOffline( data: OrderOfflineDto):Promise<OrderEntity>; //email: string, 
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   