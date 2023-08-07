import { Inject, Injectable } from "@nestjs/common";
import { BaseService } from "src/modules/bases/base.abstract";
import { OrderDto } from "./order-dto/order.dto";
import { IOrderService } from "./order.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./order.entity";
import { Repository } from "typeorm";
import { IShippingService } from "../shipping/Shipping.service.interface";
import { IPaymentService } from "../payment/payment.service.interface";
import { IProductService } from "src/modules/products/product/product.service.interface";
import { IUserService } from "src/modules/users/user/user.service.interface";
import { IEmployeeService } from "src/modules/users/employee/Employee.service.interface";
import { CreateOrderDto } from "./order-dto/create-order.dto";
import { IOrderDetailService } from "./order-detail/order-detail.service.interface";
import { OrderDetailEntity } from "./order-detail.entity";
import { GetProductForOrderDto } from "src/modules/products/product/product-dto/get-product-order.dto";
import { ShippingEntity } from "../shipping/shipping.entity";
import { IDiscountService } from "src/modules/products/discount/discount.service.interface";
import { DiscountEntity } from "src/modules/products/discount/discount.entity";
import { EmployeeEntity } from "src/modules/users/employee/employee.entity";
import { UserEntity } from "src/modules/users/user/user.entity";
import { PaymentEntity } from "../payment/payment.entity";
import { GetTaskOrdersDto } from "./order-dto/get-task-orders.dto";

@Injectable()
export class OrderService extends BaseService<OrderEntity> implements IOrderService{
    constructor(
    @InjectRepository(OrderEntity) 
    private orderRepository: Repository<OrderEntity>,

    @Inject('IShippingService')
    private shippingService: IShippingService,
    @Inject('IDiscountService')
    private discountService: IDiscountService,
    @Inject('IPaymentService')
    private paymnetService: IPaymentService,
    @Inject('IProductService')
    private productService: IProductService,
    @Inject('IUserService')
    private userService: IUserService,
    @Inject('IEmployeeService')
    private employeeService: IEmployeeService,
    @Inject('IOrderDetailService')
    private orderDetailService: IOrderDetailService,


    ) {
        super(orderRepository);
    }


    async createNewOrder(data: CreateOrderDto): Promise<OrderEntity> {
            //  khởi tạo các giá trị
            let calculattingTotalPrice = 0
            const newOrder = new OrderEntity();
            newOrder.status = 'Confirm';
            newOrder.total_price = 0;
            const orderCreated = await this.createOne(newOrder);
            console.log("orderCreated:::", orderCreated);
            
        try {
            //  get danh sách các prodct bằng list id
            const getProductsByIds = await this.productService.getProductsByIds(data.products);
           
            const orderDetailCreated = getProductsByIds.map(async (product, index) => {
                const newOrderDetail = new OrderDetailEntity();
                newOrderDetail.order_id = orderCreated.order_id;
                newOrderDetail.product_id = product.product_id;
                newOrderDetail.quantity = data.products[index].quantity;
                newOrderDetail.product = product;
                newOrderDetail.order = orderCreated;

                product.quantity -= data.products[index].quantity;
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

            const findEmployee: EmployeeEntity = await this.employeeService.getOneById(data.employee_id);
            const findUser: UserEntity = await this.userService.getOneById(data.user_id);
            const findPayment: PaymentEntity = await this.paymnetService.getOneById(data.payment_id);
          
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
            const orderDetail = await this.orderDetailService.findOrderDetailByOrderId(order.order_id);
            console.log("orderDetail",orderDetail)

            const customer = (await Promise.resolve(order.user)).last_name + ' ' + (await Promise.resolve(order.user)).first_name;
            console.log(customer)

            const taskOrder = new GetTaskOrdersDto();
            taskOrder.id = String(order.order_id);
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

}