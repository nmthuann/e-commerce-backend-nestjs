import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/bases/base.abstract';
import { IOrderDetailService } from './order-detail.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailEntity } from '../order-detail.entity';
import { Repository } from 'typeorm';
import { IProductService } from 'src/modules/products/product/product.service.interface';
import { ProductDto } from 'src/modules/products/product/product-dto/product.dto';
import { OrderDetailError } from 'src/common/errors/errors';

@Injectable()
export class OrderDetailService
  extends BaseService<OrderDetailEntity>
  implements IOrderDetailService
{
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

  async findOrderDetailByOrderId(
    order_id: number,
  ): Promise<OrderDetailEntity[]> {
    const findOrderDetails = await this.orderDetailRepository.find({
      where: {
        order_id: order_id,
      },
      relations: {
        product: true,
      },
    });
    return findOrderDetails;
  }

  async getTotalPriceByOrderId(order_id: number): Promise<number> {
    // return 0;
    try {
      //const orderDetails = await this.findOrderDetailByOrderId(order_id);
      const orderDetails = await this.orderDetailRepository.find({
        where: {
          order_id: order_id,
        },
        relations: ['product'], // To also fetch the product details for each order detail
      });
      console.log('orderDetails :::', orderDetails);
      // Calculate the total price
      let totalPrice = 0;

      // Get the current date
      // const now = new Date();

      for (const orderDetail of orderDetails) {
        const { quantity, product } = orderDetail;

        if (product) {
          // Fetch the product to get the discount
          const findDiscount: ProductDto = await this.productService.getOneById(
            product.product_id,
          );

          // Check if the product has a discount and the discount is not expired
          if (findDiscount.discount) {
            //&& findDiscount.__discount__.expired >= now
            // Apply the discount to the price
            totalPrice +=
              quantity *
              (product.price -
                product.price * (findDiscount.discount.percent / 100));
            console.log('totalPrice:::', totalPrice);
          } else {
            // No discount or discount has expired, calculate the price without discount
            totalPrice += quantity * product.price;
          }
        }
      }

      return totalPrice;
    } catch (error) {
      console.error('Error calculating total price:', error.message);
      throw new Error(OrderDetailError.TOTAL_PRICE_FAILED);
    }
  }

  async countProductSold(order_id: number): Promise<number> {
    try {
      let count = 0;
      const findProducts = await this.orderDetailRepository.find({
        where: { order_id: order_id },
      });
      for (const orderDetail of findProducts) {
        count += orderDetail.quantity;
      }
      return count;
    } catch (error) {
      console.log(`${error.message} is problem!`);
      throw error;
    }
  }
}
