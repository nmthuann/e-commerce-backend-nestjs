import { Inject, Injectable } from '@nestjs/common';
import { IOrderDetailService } from './order-detail.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailEntity } from '../order-detail.entity';
import { Repository } from 'typeorm';
import { IProductService } from 'src/modules/products/product/product.service.interface';
import { ProductDto } from 'src/modules/products/product/product-dto/product.dto';
import { OrderDetailError } from 'src/constants/errors.enum';
import { ProductEntity } from 'src/modules/products/product/product.entity';
import { AbstractBaseService } from 'src/common/bases/base.abstract.service';

@Injectable()
export class OrderDetailService
  extends AbstractBaseService<OrderDetailEntity>
  implements IOrderDetailService
{
  constructor(
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailRepository: Repository<OrderDetailEntity>,
    @Inject('IProductService')
    private readonly productService: IProductService,
  ) {
    super(orderDetailRepository);
  }


  async updateQuantityProduct(order_id: any): Promise<void> {
    const findOrder = await this.findOrderDetailByOrderId(order_id);
    findOrder.map(async (order_detail) =>{
      const findProduct: ProductEntity = await this.productService.getOneById(order_detail.product_id);
      findProduct.quantity = findProduct.quantity + order_detail.quantity;
      await this.productService.updateOneById(findProduct.product_id, findProduct);
    })
  }

  async createMany(data: OrderDetailEntity[]): Promise<OrderDetailEntity[]> {
    return this.orderDetailRepository.create(data);
  }

  async findOrderDetailByOrderId(
    order_id: number,
  ): Promise<OrderDetailEntity[]> {

    //  try catch -> not found 
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

    try {
      const orderDetails = await this.orderDetailRepository.find({
        where: {
          order_id: order_id,
        },
        relations: ['product'], 
      });
      console.log('orderDetails :::', orderDetails);
      let totalPrice = 0;
      for (const orderDetail of orderDetails) {
        const { quantity, product } = orderDetail;

        if (product) {
   
          const findDiscount: ProductDto = await this.productService.getOneById(
            product.product_id,
          );
          if (findDiscount.discount) {
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
      let countProductSold = 0;
      const findProducts = await this.orderDetailRepository.find({
        where: { order_id: order_id },
      });
      for (const orderDetail of findProducts) {
        countProductSold += orderDetail.quantity;
      }
      return countProductSold;
    } catch (error) {
      console.log(`${error.message} is problem!`);
      throw error;
    }
  }
}
