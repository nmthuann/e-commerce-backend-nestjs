import { Inject, Injectable } from "@nestjs/common";
import { BaseService } from "src/modules/bases/base.abstract";
import { OrderDetailDto } from "../order-dto/order-detail.dto";
import { IOrderDetailService } from "./order-detail.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderDetailEntity } from "../order-detail.entity";
import { Repository } from "typeorm";
import { IProductService } from "src/modules/products/product/product.service.interface";
import { ProductEntity } from "src/modules/products/product/entities/product.entity";
import { ProductDto } from "src/modules/products/product/product-dto/product.dto";

@Injectable()
export class OrderDetailService extends BaseService<OrderDetailEntity> implements IOrderDetailService{
    constructor(
    @InjectRepository(OrderDetailEntity) 
    private orderDetailRepository: Repository<OrderDetailEntity>,
    @Inject('IProductService')
    private productService: IProductService,
    
    ) {
        super(orderDetailRepository);
    }

    async createMany(data: OrderDetailEntity[]): Promise<OrderDetailEntity[]> {
        return this.orderDetailRepository.create(data);
    }


    async findOrderDetailByOrderId(order_id: number): Promise<OrderDetailEntity []> {
        const findOrderDetails = await this.orderDetailRepository.find({
            where: {
                order_id: order_id
            },
            relations: {
                product: true,
            }
        })
        return findOrderDetails;
    }


    async getTotalPriceByOrderId(order_id: number): Promise<number> {
        try {
            //const orderDetails = await this.findOrderDetailByOrderId(order_id);
            const orderDetails = await this.orderDetailRepository.find({
            where: {
                order_id: order_id,
            },
                relations: ['product'], // To also fetch the product details for each order detail
            });
            console.log("orderDetails :::", orderDetails )
            // Calculate the total price
            let totalPrice = 0;
            
            // Get the current date
            const now = new Date();


            for (const orderDetail of orderDetails) {
            const { quantity, product } = orderDetail;

                if (product) {
                    // Fetch the product to get the discount
                    const findDiscount: ProductDto = await this.productService.getOneById(product.product_id);
                    console.log("findDiscount:::", findDiscount)

                    // Check if the product has a discount and the discount is not expired
                    if (findDiscount.__discount__ && findDiscount.__discount__.expired >= now) {
                        // Apply the discount to the price
                        totalPrice += quantity * (product.price - (product.price * (findDiscount.__discount__.percent / 100)));
                        console.log("totalPrice:::", totalPrice)
                    } else {
                        // No discount or discount has expired, calculate the price without discount
                        totalPrice += quantity * product.price;
                    }
                }
            }

        return totalPrice;
        } catch (error) {
            console.error('Error calculating total price:', error.message);
            throw error;
        }


    }
}

 