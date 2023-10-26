import { Inject, Injectable } from "@nestjs/common";
import { BaseService } from "src/modules/bases/base.abstract";
import { RevenueByMonth } from "./order-dto/order.dto";
import { IOrderService } from "./order.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./order.entity";
import {  Repository } from "typeorm";
import { IShippingService } from "../shipping/Shipping.service.interface";
import { IPaymentService } from "../payment/payment.service.interface";
import { IProductService } from "src/modules/products/product/product.service.interface";
import { IUserService } from "src/modules/users/user/user.service.interface";
import { IEmployeeService } from "src/modules/users/employee/Employee.service.interface";
import { IOrderDetailService } from "./order-detail/order-detail.service.interface";
import { OrderDetailEntity } from "./order-detail.entity";
import { ShippingEntity } from "../shipping/shipping.entity";
import { IDiscountService } from "src/modules/products/discount/discount.service.interface";
import { DiscountEntity } from "src/modules/products/discount/discount.entity";
import { EmployeeEntity } from "src/modules/users/employee/employee.entity";
import { UserEntity } from "src/modules/users/user/user.entity";
import { PaymentEntity } from "../payment/payment.entity";
import { GetTaskOrdersDto } from "./order-dto/get-task-orders.dto";
import { GetCustomerListDto } from "src/modules/users/user/user-dto/get-customer-list.dto";
import { OrderStatus } from "src/modules/bases/enums/order-status.enum";
import { Role } from "src/modules/bases/enums/role.enum";
import { OrderOfflineDto } from "./order-dto/order-offline.dto";
import { OrderError, ProductError } from "src/common/errors/errors";



@Injectable()
export class OrderService extends BaseService<OrderEntity> implements IOrderService{
    constructor(
    @InjectRepository(OrderEntity) 
    private orderRepository: Repository<OrderEntity>,

    //  ORDER
    @Inject('IShippingService')
    private shippingService: IShippingService,
    @Inject('IDiscountService')
    private discountService: IDiscountService,
    @Inject('IPaymentService')
    private paymnetService: IPaymentService,
    @Inject('IOrderDetailService')
    private orderDetailService: IOrderDetailService,

    //  PRODUCT
    @Inject('IProductService')
    private productService: IProductService,

    // USER
    @Inject('IUserService')
    private userService: IUserService,
    @Inject('IEmployeeService')
    private employeeService: IEmployeeService,

    ) {
        super(orderRepository);
    }


    async getTotalPriceByOrderId(order_id: number): Promise<number> {
        return await this.orderDetailService.getTotalPriceByOrderId(order_id);
    }


    async createNewOrderOffline(data: OrderOfflineDto): Promise<OrderEntity> { //email: string,  //CreateOrderDto
            //  khởi tạo các giá trị
            let calculattingTotalPrice = 0
            const newOrder = new OrderEntity();
            newOrder.status = OrderStatus.Confirmed;
            newOrder.total_price = 0;
            newOrder.contact = data.contact;
            newOrder.delivery_address = data.delivery_address
            const orderCreated = await this.createOne(newOrder);
            console.log("orderCreated:::", orderCreated);
            
        try {
            //  get danh sách các prodct bằng list id
        
            const getProductsByIds = await this.productService.getProductsByIds(data.order_detail);
           
            const orderDetailCreated = getProductsByIds.map(async (product, index) => {
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
            })
            console.log("orderDetailCreated:::",await Promise.all(orderDetailCreated));

            // tính  giá tiền
            // total price in order detail
            const getTotalPriceInOrderDetail = 
                await this.orderDetailService.getTotalPriceByOrderId(orderCreated.order_id);

            // thành tiền
            const findShipping: ShippingEntity = await this.shippingService.getOneById(data.shipping_id);
            console.log("findShipping:::", findShipping);
            const findDiscount: DiscountEntity = await this.discountService.getOneById(data.discount_id);
            console.log("findDiscount:::", findDiscount);
            const now = new Date();
            if (findDiscount && (findDiscount.expired > now)){
                calculattingTotalPrice = 
                    findShipping.ship_cost + 
                    getTotalPriceInOrderDetail - 
                    (getTotalPriceInOrderDetail*((findDiscount.percent)/100))
                    console.log(" calculattingTotalPrice:::",  calculattingTotalPrice)
            }
            else {
                calculattingTotalPrice = findShipping.ship_cost + getTotalPriceInOrderDetail;
                console.log(" calculattingTotalPrice:::",  calculattingTotalPrice)

            }

            // await this.userService.getEmployeeByEmail(email)
            const findEmployee: EmployeeEntity = await this.employeeService.getOneById(data.employee_id); //await this.userService.getEmployeeByEmail(email); // await this.employeeService.getOneById(data.employee_id);
            const findUser: UserEntity =   null // await this.userService.getOneById(data.user_id);
            const findPayment: PaymentEntity = await this.paymnetService.getOneById(1); //data.payment_id
          
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
        console.log(findOrders)
        for(const order of  findOrders){
               const taskOrder = new GetTaskOrdersDto();
            const orderDetail = await this.orderDetailService.findOrderDetailByOrderId(order.order_id);
            console.log("orderDetail",orderDetail)


            // let customer = '';
            // console.log(order.user)
            // if (!order.user){
            //     customer = 'No User'
            // }
            // 
            const customer =  (await Promise.resolve(order.user)).last_name + ' ' +(await Promise.resolve(order.user)).first_name; //       
                            // console.log(customer)

         
            taskOrder.id = String(order.order_id);
           

            // taskOrder.title = customer == 'No User'
            //     ? `Customer ${customer} bought ${orderDetail.length} product`
            //     : `Customer ${order.contact} bought ${orderDetail.length} product`;
            taskOrder.title = `Customer ${customer} bought ${orderDetail.length} product`;
            taskOrder.label = (await Promise.resolve(order.payment)).payment_id === 2 ? 'online' : 'offline';
            taskOrder.status = order.status;
            taskOrder.employee = order.status === 'pending' ? 'Not Employee' : (await Promise.resolve(order.employee)).employee_id;
            taskOrder.total_price = String(order.total_price);
            taskOrder.priority = shippingSuplier[`${(await Promise.resolve(order.shipping)).shipping_id}`];
            taskOrder.create = order.createdAt.toLocaleString();
            //  `${order.createdAt.getDate()}-${order.createdAt.getMonth()}-${order.createdAt.getFullYear()}`
            console.log(taskOrder);
            taskOrderList.push(taskOrder);
        }

        console.log(taskOrderList)
        return taskOrderList;
    }


    async getCountOrdersByUserId(user_id: number): Promise<number> {
        // const findOrdersByUserId = await this.orderRepository.

        // return ;

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
                user: { user_id }, // Assuming there's a relationship between OrderEntity and UserEntity
                status: OrderStatus.Canceled //'canceled', // Assuming the status indicating canceled orders is 'canceled'
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
        console.log(findCustomers)

        for(const customer of findCustomers){
                
            const employee = customer.employee; // No need for Promise.resolve here
            const admin = customer.account;
            const role = (await Promise.resolve(admin)).role;

            if (employee === null && role !== Role.Admin ) {
                const getCustomer = new GetCustomerListDto();
                getCustomer.avatar_url = customer.avatar_url;
                getCustomer.customer_id = String(customer.user_id);
                getCustomer.customer_name = `${customer.last_name} ${customer.first_name}`;
                getCustomer.birthday = customer.birthday.toLocaleDateString();
                getCustomer.gender = customer.gender;
                getCustomer.count_order = String(await this.getCountOrdersByUserId(customer.user_id));
                getCustomer.total_price = String(await this.getTotalPriceOfUser(customer.user_id));
                getCustomer.canceled = String(await this.getCountOrderCanceledByUserId(customer.user_id));
                getCustomer.address = customer.address;
                getCustomerList.push(getCustomer);
            }
            // Push into the list
           
        }
        return getCustomerList;
    }


    async getTotalRevenue(): Promise<number> {
        const findOrders = await this.getAll();
        let totalRevenue: number = 0;
        for (const order of findOrders){
            if (order.status ==  OrderStatus.Completed){
                totalRevenue += order.total_price
            }
        }
        return totalRevenue;
    }


    async getCountProductSold(): Promise<number> {
        const findOrders = await this.getAll();
        let count : number = 0;
        for (const order of findOrders){
            if (order.status == OrderStatus.Completed){
                count = count + (await this.orderDetailService.countProductSold(order.order_id))
            }
        }
        return count;
    }


    async getOrdersHasCompletedStatus(): Promise<OrderEntity[]> {
        const findOrders = await this.orderRepository.find({
            where:{
                status: OrderStatus.Completed
            }
        })
        
        return findOrders;
    }


    

    async getRevenueByMonth(): Promise<RevenueByMonth> {
        const completedOrders = await this.getOrdersHasCompletedStatus();

        // Tạo mảng các Promise để tính doanh thu cho mỗi đơn hàng
        const revenuePromises = completedOrders.map(async order => {
            const orderMonth = order.createdAt.getMonth();
            const orderTotal = order.total_price;
            return { orderMonth, orderTotal };
        });

        const revenueResults = await Promise.all(revenuePromises);

        // Tính tổng giá trị đơn hàng cho từng tháng
        const aggregatedRevenue: RevenueByMonth = {
            month: "",
            total: 0
        };
        for (const revenue of revenueResults) {
            const { orderMonth, orderTotal } = revenue;

            if (aggregatedRevenue[orderMonth]) {
            aggregatedRevenue[orderMonth] += orderTotal;
            } else {
            aggregatedRevenue[orderMonth] = orderTotal;
            }
        }


        console.log(aggregatedRevenue);

        return aggregatedRevenue;
    }

    
    // data: OrderOnlineDto,
    async createOrderOnline(customer: string, productIds: number[]): Promise<OrderEntity> {

        

        let calculattingTotalPrice = 0

        const findPayment  = await this.paymnetService.getOneById(2);
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
            const getProductsByIds = await this.productService.getProductsByProductIds(productIds);
            const orderDetailCreated = getProductsByIds.map(async (product) => { //, index
                const newOrderDetail = new OrderDetailEntity();
                newOrderDetail.order_id = orderCreated.order_id;
                newOrderDetail.product_id = product.product_id;
                newOrderDetail.quantity = 1;
                newOrderDetail.product = product;
                newOrderDetail.order = orderCreated;
                
                // product.quantity -= data.order_detail[index].quantity;
                // console.log("test:::", test)
                // cập nhật số lượng 
                product.quantity = product.quantity - 1;
                await this.productService.updateOneById(product.product_id, product);
                await this.orderDetailService.createOne(newOrderDetail);
            })
            console.log("orderDetailCreated::::",await Promise.all(orderDetailCreated));

            // TỔNG TIỀN
            const getTotalPriceInOrderDetail = 
                await this.orderDetailService.getTotalPriceByOrderId(orderCreated.order_id);

            // THÀNH TIỀN = TOTAL + SHIP_COST
            const findShipping: ShippingEntity = await this.shippingService.getOneById(2);
            calculattingTotalPrice = findShipping.ship_cost + getTotalPriceInOrderDetail;
          
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
        // return orderCreated;
    }


}