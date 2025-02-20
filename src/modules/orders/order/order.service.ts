import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/bases/base.abstract';
import { RevenueByMonth } from './order-dto/order.dto';
import { IOrderService } from './order.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { Between, Repository } from 'typeorm';
import { IShippingService } from '../shipping/Shipping.service.interface';
import { IPaymentService } from '../payment/payment.service.interface';
import { IProductService } from 'src/modules/products/product/product.service.interface';
import { IUserService } from 'src/modules/users/user/user.service.interface';
import { IEmployeeService } from 'src/modules/users/employee/Employee.service.interface';
import { IOrderDetailService } from './order-detail/order-detail.service.interface';
import { OrderDetailEntity } from './order-detail.entity';
import { ShippingEntity } from '../shipping/shipping.entity';
import { IDiscountService } from 'src/modules/products/discount/discount.service.interface';
import { DiscountEntity } from 'src/modules/products/discount/discount.entity';
import { EmployeeEntity } from 'src/modules/users/employee/employee.entity';
import { UserEntity } from 'src/modules/users/user/user.entity';
import { PaymentEntity } from '../payment/payment.entity';
import { GetTaskOrdersDto } from './order-dto/get-task-orders.dto';
import { GetCustomerListDto } from 'src/modules/users/user/user-dto/get-customer-list.dto';
import { OrderStatus } from 'src/modules/bases/enums/order-status.enum';
import { Role } from 'src/modules/bases/enums/role.enum';
import { OrderOfflineDto } from './order-dto/order-offline.dto';
import { OrderError } from 'src/constants/errors.enum';
import { CategoryEnum } from 'src/modules/bases/enums/order.enum';

enum OrderPaymentMethod{
  
  OfflinePayment = 1,
  OnlinePayment = 2,

}

@Injectable()
export class OrderService
  extends BaseService<OrderEntity>
  implements IOrderService
{
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @Inject('IShippingService')
    private shippingService: IShippingService,
    @Inject('IDiscountService')
    private discountService: IDiscountService,
    @Inject('IPaymentService')
    private paymnetService: IPaymentService,
    @Inject('IOrderDetailService')
    private orderDetailService: IOrderDetailService,
    @Inject('IProductService')
    private productService: IProductService,
    @Inject('IUserService')
    private userService: IUserService,
    @Inject('IEmployeeService')
    private employeeService: IEmployeeService,
    
  ) {
    super(orderRepository);
  }

  async findTopUserBuyProduct(top: number): Promise<any[]> {
    const currentYear = new Date().getFullYear();    
    const topUsers = await this.orderRepository
   .createQueryBuilder('order')
    .select('order.user_id', 'user_id')
    .addSelect('SUM(order.total_price)', 'total_price')
    .addSelect('user.email', 'email') // Include email field
    .addSelect('user.avatar_url', 'avatar_url') // Include avatar_url field
    .addSelect("CONCAT(user.last_name, ' ', user.first_name)", 'full_name')
    .innerJoin('order.user', 'user')
    .where({
      createdAt: Between(new Date(`${currentYear}-01-01`), new Date(`${currentYear + 1}-01-01`)),
      status: 'completed'
    })
    .groupBy('order.user_id, user.email, user.avatar_url, user.first_name, user.last_name')
    .orderBy('total_price', 'DESC')
    .limit(top)
    .getRawMany();

    return topUsers;
  }



  async statisticalCategoryByOrder(): Promise<any> {
    const currentYear = new Date().getFullYear();
    const orderCompletedByYear = await this.getOrdersHasCompletedStatusInThisYear(currentYear);
    const categoryCounts: Record<string, { name: string; count: number }> = {};
    const categoryArray: string[] = Object.values(CategoryEnum).map(category => CategoryEnum[category]);
    categoryArray.forEach(categoryName => {
      categoryCounts[categoryName] = { name: categoryName, count: 0 };
    });

    console.table(categoryArray);

    for (const order of orderCompletedByYear) {
      const getOrderDetailByOrderId = await this.orderDetailService.findOrderDetailByOrderId(order.order_id);

      for (const orderDetail of getOrderDetailByOrderId) {
        const category = (await Promise.resolve(await Promise.resolve(orderDetail.product))).category;
        const categoryId = (await Promise.resolve(category)).category_name;
        switch (categoryId) {
          case CategoryEnum.Apple:
            categoryCounts[CategoryEnum.Apple].count += 1;
            break;
          case CategoryEnum.Samsung:
            categoryCounts[CategoryEnum.Samsung].count += 1;
            break;
          case CategoryEnum.Xiaomi:
            categoryCounts[CategoryEnum.Xiaomi].count += 1;
            break;
          case CategoryEnum.Oppo:
            categoryCounts[CategoryEnum.Oppo].count += 1;
            break;
          case CategoryEnum.Sony:
            categoryCounts[CategoryEnum.Sony].count += 1;
            break;
          // Add cases for other categories
          default:
            // Handle any unexpected category ID
            break;
        }
      }
    }
    console.log(categoryCounts)
    const result: { name: string; count: number }[] = Object.values(categoryCounts);
    return result;
  }

  async getOrdersHasCompletedStatusInThisYear(year: number): Promise<OrderEntity[]> {
    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${year + 1}-01-01T00:00:00Z`);
    const findOrders = await this.orderRepository.find({
      where: {
        status: OrderStatus.Completed,
        createdAt: Between(startDate, endDate),
      },
      // relations:{
      //   user: true
      // }
    });

    return findOrders;
  }
  


  getMonthName(month: number): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec',
  ];

  // Kiểm tra xem month có nằm trong khoảng từ 1 đến 12 không
  if (month >= 1 && month <= 12) {
    return months[month - 1]; // Trừ 1 vì mảng bắt đầu từ 0
  } else {
    return 'Invalid Month';
  }
}

  
  async statisticalOnOffOrderCount(): Promise<any> {
    /**
     * lấy danh sách các đơn hàng thành công trong năm nay.
     * lấy Create At: map the từng tháng, 
     * trong tháng 1 có 4 ĐH: 3 đơn hàng on,  1 off
     */
    const currentYear = new Date().getFullYear();
    const orderCompletedByYear = await this.getOrdersHasCompletedStatusInThisYear(currentYear);
    const monthlyCounts: Record<string, { name: string; on: number; off: number }> = {};
    for (const order of orderCompletedByYear) {
      const orderDate = new Date(order.createdAt);
      const month = orderDate.getMonth() + 1;
      const payment = (await Promise.resolve(order.payment)).payment_id;

      if (!monthlyCounts[month]) {
        monthlyCounts[month] = { name: this.getMonthName(month), on: 0, off: 0 };
      }

      if (payment === OrderPaymentMethod.OfflinePayment) {
        monthlyCounts[month].off += 1;
      } else if (payment === OrderPaymentMethod.OnlinePayment) {
        monthlyCounts[month].on += 1;
      }
    }

    const result: any[] = Object.values(monthlyCounts);
    console.table(result);
    return result;
  }


  /**
   * idea: >>>>>   get current status order
   *        if 'pending' then: -> 1. confirmed or 2. canceled
   *            =>  |decrease quantity (product)| >< restore quantity (product)
   *        if 'confirmed' then:  -> in progress
   *            =>  not  [canceled | completed | refunded]
   *        if 'in progress' then: 1. completed or 2. refunded
   *            =>   not  [canceled | confirmed ]
   * 
   * @param order : đơn hàng hiện tại
   * @param status : status muốn thay update
   * @returns order đã update
   */


  //    => PENDING to CANCELED
  async handleCanceledOrder(order_id: number, employee_email: string) {
    const findOrder: OrderEntity = await this.getOneById(order_id);
    const findEmployee = await this.userService.getEmployeeByEmail(employee_email);

    if(!findOrder){
      return {message: OrderError.ORDER_NOT_FOUND};
    }
    const currentStatus = findOrder.status; 
    if(currentStatus === OrderStatus.Pending) {
      const newOrder = findOrder;
      newOrder.status = OrderStatus.Canceled;
      newOrder.employee = findEmployee;
      const updateStatus = await this.updateOneById(findOrder.order_id, newOrder);
      //  update quantity product
      await this.orderDetailService.updateQuantityProduct(updateStatus.order_id);
      return updateStatus;
    }
    // else if(currentStatus){
      
    // }
    else{
      return {message: OrderError.CANCELED_ORDER_FAILED};
    }
  }

  //    => PENDING to CONFIRMED
  async handleConfirmedOrder(order_id: number, employee_email: string) {
    const findOrder: OrderEntity = await this.getOneById(order_id);
    const findEmployee = await this.userService.getEmployeeByEmail(employee_email);

    if(!findOrder){
      return {message: OrderError.ORDER_NOT_FOUND};
    }
    const currentStatus = findOrder.status; 
    if(currentStatus === OrderStatus.Pending) {
      const newOrder = findOrder;
      newOrder.status = OrderStatus.Confirmed;
      newOrder.employee = findEmployee;
      const updateStatus = await this.updateOneById(findOrder.order_id, newOrder);
      return updateStatus;
    }
    else{
      return {message: OrderError.UPDATE_STATUS_ORDER_FAILED};
    }
  }

  //    => CONFIRMED to IN PROGRESS
  async handleInProgressOrder(order_id: number) {
    const findOrder = await this.getOneById(order_id);
    if(!findOrder){
      return {message: OrderError.ORDER_NOT_FOUND};
    }
    const currentStatus = findOrder.status; 
    if(currentStatus === OrderStatus.Confirmed) {
      const newOrder = findOrder;
      newOrder.status = OrderStatus.InProgress;
      const updateStatus = await this.updateOneById(findOrder.order_id, newOrder);
      return updateStatus;
    }
    else if(currentStatus === OrderStatus.Pending) {
      return {message:OrderError.NOT_YET_CONFIRM};
    }
    else{
       return {message: OrderError.UPDATE_STATUS_ORDER_FAILED};
    }
  }

  //    => IN PROGRESS to COMPLETED
  async handleCompletedOrder(order_id: number) {
    const findOrder = await this.getOneById(order_id);
    if(!findOrder){
      return {message: OrderError.ORDER_NOT_FOUND};
    }
    const currentStatus = findOrder.status; 
    if(currentStatus === OrderStatus.InProgress) {
      const newOrder = findOrder;
      newOrder.status = OrderStatus.Completed;
      const updateStatus = await this.updateOneById(findOrder.order_id, newOrder);
      return updateStatus;
    }
    else{
       return {message: OrderError.UPDATE_STATUS_ORDER_FAILED};
    }
  }

  //    => IN PROGRESS to REFUNDED
  async handleRefundedOrder(order_id: number) {
    const findOrder = await this.getOneById(order_id);
    if(!findOrder){
      return {message: OrderError.ORDER_NOT_FOUND};
    }
    const currentStatus = findOrder.status; 
    if(currentStatus === OrderStatus.InProgress) {
      const newOrder = findOrder;
      newOrder.status = OrderStatus.Refunded;
      const updateStatus = await this.updateOneById(findOrder.order_id, newOrder);
      return updateStatus;
    }
    else{
      return {message: OrderError.UPDATE_STATUS_ORDER_FAILED};
    }
  }


  async updateStatusOrder(order_id: number, status: string): Promise<OrderEntity | object > {
    const findOrder = await this.getOneById(order_id);
    if(!findOrder){
      return {message: OrderError.ORDER_NOT_FOUND};
    }

    switch (status) {
      case OrderStatus.Canceled:
        return 
      case OrderStatus.Confirmed:
        break;
      case OrderStatus.InProgress:
        break;
      case OrderStatus.Completed:
        break;
      case OrderStatus.Refunded:
        break;
    default:
      break;
    }
  }



  async getTotalPriceByOrderId(order_id: number): Promise<number> {
    return await this.orderDetailService.getTotalPriceByOrderId(order_id);
  }

  async createNewOrderOffline(data: OrderOfflineDto): Promise<OrderEntity> {
    //email: string,  //CreateOrderDto
    //  khởi tạo các giá trị
    let calculattingTotalPrice = 0;
    const newOrder = new OrderEntity();
    newOrder.status = OrderStatus.Confirmed;
    newOrder.total_price = 0;
    newOrder.contact = data.contact;
    newOrder.delivery_address = data.delivery_address;
    const orderCreated = await this.createOne(newOrder);
    console.log('orderCreated:::', orderCreated);

    try {
      //  get danh sách các prodct bằng list id

      const getProductsByIds = await this.productService.getProductsByIds(
        data.order_detail,
      );

      const orderDetailCreated = getProductsByIds.map(
        async (product, index) => {
          const newOrderDetail = new OrderDetailEntity();
          newOrderDetail.order_id = orderCreated.order_id;
          newOrderDetail.product_id = product.product_id;
          newOrderDetail.quantity = data.order_detail[index].quantity;
          newOrderDetail.product = product;
          newOrderDetail.order = orderCreated;

          product.quantity -= data.order_detail[index].quantity;
          // console.log("test:::", test)
          // cập nhật số lượng
          await this.productService.updateOneById(product.product_id, product);
          await this.orderDetailService.createOne(newOrderDetail);
        },
      );
      console.log(
        'orderDetailCreated:::',
        await Promise.all(orderDetailCreated),
      );

      // tính  giá tiền
      // total price in order detail
      const getTotalPriceInOrderDetail =
        await this.orderDetailService.getTotalPriceByOrderId(
          orderCreated.order_id,
        );

      // thành tiền
      const findShipping: ShippingEntity =
        await this.shippingService.getOneById(data.shipping_id);
      console.log('findShipping:::', findShipping);
      const findDiscount: DiscountEntity =
        await this.discountService.getOneById(data.discount_id);
      console.log('findDiscount:::', findDiscount);
      const now = new Date();
      if (findDiscount && findDiscount.expired > now) {
        calculattingTotalPrice =
          findShipping.ship_cost +
          getTotalPriceInOrderDetail -
          getTotalPriceInOrderDetail * (findDiscount.percent / 100);
        console.log(' calculattingTotalPrice:::', calculattingTotalPrice);
      } else {
        calculattingTotalPrice =
          findShipping.ship_cost + getTotalPriceInOrderDetail;
        console.log(' calculattingTotalPrice:::', calculattingTotalPrice);
      }

      const findEmployee: EmployeeEntity =
        await this.employeeService.getOneById(data.employee_id); 
      const findUser: UserEntity = null;
      const findPayment: PaymentEntity = await this.paymnetService.getOneById(
        1,
      );

      //  cập nhật order
      const updateOrder = new OrderEntity();
      updateOrder.order_id = orderCreated.order_id;
      updateOrder.total_price = calculattingTotalPrice;
      updateOrder.status = orderCreated.status;
      updateOrder.payment = findPayment;
      updateOrder.shipping = findShipping;
      updateOrder.user = findUser;
      updateOrder.employee = findEmployee;
      updateOrder.discount = findDiscount;

      return await this.orderRepository.save(updateOrder);
    } catch (error) {
      console.error('Error calculating total price:', error.message);
      await this.deleteOneById(orderCreated.order_id);
      throw error;
    }
  }

  async getTaskOrders(): Promise<GetTaskOrdersDto[]> {
    /**
     * get All Order[]
     * nếu ... push vào
     */

    const taskOrderList: GetTaskOrdersDto[] = [];

    const shippingSuplier = {
      3: 'GHN',
      1: 'GHTK',
      2: 'GHHT',
    };

    const findOrders = await this.getAll();
    for (const order of findOrders) {
      const taskOrder = new GetTaskOrdersDto();
      const orderDetail =
        await this.orderDetailService.findOrderDetailByOrderId(order.order_id);
      const customer =
        (await Promise.resolve(order.user)).last_name +
        ' ' +
        (await Promise.resolve(order.user)).first_name; //

      taskOrder.id = String(order.order_id);
      taskOrder.title = `Customer ${customer} bought ${orderDetail.length} product`;
      taskOrder.label =
        (await Promise.resolve(order.payment)).payment_id === 2
          ? 'online'
          : 'offline';
      taskOrder.status = order.status;
      taskOrder.employee =
        order.status === 'pending'
          ? 'Not Employee'
          : (await Promise.resolve(order.employee)).employee_id;
      taskOrder.total_price = String(order.total_price);
      taskOrder.priority =
        shippingSuplier[
          `${(await Promise.resolve(order.shipping)).shipping_id}`
        ];
      taskOrder.create = order.createdAt.toLocaleString();
      taskOrder.delivery_address = order.delivery_address;
     
      taskOrderList.push(taskOrder);
    }

 
    return taskOrderList;
  }

  async getCountOrdersByUserId(user_id: number): Promise<number> {
    try {
      const count = await this.orderRepository.count({
        where: {
          user: { user_id },
        },
      });

      return count;
    } catch (error) {
      console.error('Error fetching order count:', error.message);
      throw error;
    }
  }

  async getTotalPriceOfUser(user_id: number): Promise<number> {
    try {
      const totalPrice = await this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(order.total_price)', 'total_price')
        .where('order.user_id = :user_id', { user_id })
        .getRawOne();
      return totalPrice.total_price || 0;
    } catch (error) {
      console.error('Error calculating total price:', error.message);
      throw error;
    }
  }

  async getCountOrderCanceledByUserId(user_id: number): Promise<number> {
    try {
      const count = await this.orderRepository.count({
        where: {
          user: { user_id },
          status: OrderStatus.Canceled,
        },
      });

      return count;
    } catch (error) {
      console.error('Error fetching count of canceled orders:', error.message);
      throw error;
    }
  }

  async getCustomerList(): Promise<GetCustomerListDto[]> {
    const getCustomerList: GetCustomerListDto[] = [];
    const findCustomers: UserEntity[] = await this.userService.getAll();
    console.log(findCustomers);

    for (const customer of findCustomers) {
      const employee = customer.employee; // No need for Promise.resolve here
      const admin = customer.account;
      const role = (await Promise.resolve(admin)).role;

      if (employee === null && role !== Role.Admin) {
        const getCustomer = new GetCustomerListDto();
        getCustomer.avatar_url = customer.avatar_url;
        getCustomer.customer_id = String(customer.user_id);
        getCustomer.customer_name = `${customer.last_name} ${customer.first_name}`;
        getCustomer.birthday = customer.birthday.toLocaleDateString();
        getCustomer.gender = customer.gender;
        getCustomer.count_order = String(
          await this.getCountOrdersByUserId(customer.user_id),
        );
        getCustomer.total_price = String(
          await this.getTotalPriceOfUser(customer.user_id),
        );
        getCustomer.canceled = String(
          await this.getCountOrderCanceledByUserId(customer.user_id),
        );
        getCustomer.address = customer.address;
        getCustomerList.push(getCustomer);
      }
      // Push into the list
    }
    return getCustomerList;
  }

  async getTotalRevenue(): Promise<number> {
    const findCompletedOrders = await this.orderRepository.find({
      where: {
        status: OrderStatus.Completed
      }
    })
    let totalRevenue = 0;
    for (const order of findCompletedOrders) {
      totalRevenue += order.total_price;
    }
    return totalRevenue;
  }

  async getCountProductSold(): Promise<number> {
    const findCompletedOrders = await this.orderRepository.find({
      where: {
        status: OrderStatus.Completed
      }
    })
    let countProduct = 0;
    for (const order of findCompletedOrders) {
      countProduct =
        countProduct +
        (await this.orderDetailService.countProductSold(order.order_id));
    }
    return countProduct;
  }

  async getOrdersHasCompletedStatus(): Promise<OrderEntity[]> {
    const findOrders = await this.orderRepository.find({
      where: {
        status: OrderStatus.Completed,
      },
    });

    return findOrders;
  }

  async getRevenueByMonth(): Promise<RevenueByMonth> {
    const completedOrders = await this.getOrdersHasCompletedStatus();

    // Tạo mảng các Promise để tính doanh thu cho mỗi đơn hàng
    const revenuePromises = completedOrders.map(async (order) => {
      const orderMonth = order.createdAt.getMonth();
      const orderTotal = order.total_price;
      return { orderMonth, orderTotal };
    });

    const revenueResults = await Promise.all(revenuePromises);

    // Tính tổng giá trị đơn hàng cho từng tháng
    const aggregatedRevenue: RevenueByMonth = {
      month: '',
      total: 0,
    };
    for (const revenue of revenueResults) {
      const { orderMonth, orderTotal } = revenue;

      if (aggregatedRevenue[orderMonth]) {
        aggregatedRevenue[orderMonth] += orderTotal;
      } else {
        aggregatedRevenue[orderMonth] = orderTotal;
      }
    }

    console.table(aggregatedRevenue);

    return aggregatedRevenue;
  }

  // data: OrderOnlineDto,
  async createOrderOnline(
    customer: string,
    productIds: number[],
  ): Promise<OrderEntity> {
    let calculattingTotalPrice = 0;

    const findPayment = await this.paymnetService.getOneById(2);
    const findUser = await this.userService.getUserByEmail(customer);

    const newOrder = new OrderEntity();
    newOrder.user = findUser;
    newOrder.payment = findPayment;
    newOrder.status = OrderStatus.Pending;

    // giá trị khởi tạo
    newOrder.total_price = 0;
    newOrder.contact = null;
    newOrder.delivery_address = null;
    newOrder.discount = null;
    newOrder.shipping = null;
    newOrder.employee = null;

    const orderCreated = await this.createOne(newOrder);
    console.log(orderCreated);

    //  TÍNH TOÁN GIÁ TRỊ - CREATE ORDER DETAIL
    try {
      const getProductsByIds =
        await this.productService.getProductsByProductIds(productIds);
      const orderDetailCreated = getProductsByIds.map(async (product) => {
        //, index
        const newOrderDetail = new OrderDetailEntity();
        newOrderDetail.order_id = orderCreated.order_id;
        newOrderDetail.product_id = product.product_id;
        newOrderDetail.quantity = 1;
        newOrderDetail.product = product;
        newOrderDetail.order = orderCreated;


        product.quantity = product.quantity - 1;
        await this.productService.updateOneById(product.product_id, product);
        await this.orderDetailService.createOne(newOrderDetail);
      });
      console.log(
        'orderDetailCreated::::',
        await Promise.all(orderDetailCreated),
      );

      // TỔNG TIỀN
      const getTotalPriceInOrderDetail =
        await this.orderDetailService.getTotalPriceByOrderId(
          orderCreated.order_id,
        );

      // THÀNH TIỀN = TOTAL + SHIP_COST
      const findShipping: ShippingEntity =
        await this.shippingService.getOneById(2);
      calculattingTotalPrice =
        findShipping.ship_cost + getTotalPriceInOrderDetail;

      //  UPDATE ORDER
      const updateOrder = new OrderEntity();
      updateOrder.order_id = orderCreated.order_id;
      updateOrder.total_price = calculattingTotalPrice;
      updateOrder.status = orderCreated.status;
      updateOrder.payment = findPayment;
      updateOrder.shipping = findShipping;
      updateOrder.user = findUser;
      updateOrder.employee = null;
      updateOrder.discount = null;

      return await this.orderRepository.save(updateOrder);
    } catch (error) {
      console.error('Error calculating total price:', error.message);
      await this.deleteOneById(orderCreated.order_id);
      throw new Error(OrderError.CREATE_ORDER_ONLINE_ERROR);
    }
  }
}
