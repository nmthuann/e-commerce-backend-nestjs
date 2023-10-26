import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from './discount.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/modules/bases/base.abstract';
import { IDiscountService } from './discount.service.interface';

@Injectable()
export class DiscountService
  extends BaseService<DiscountEntity>
  implements IDiscountService
{
  constructor(
    @InjectRepository(DiscountEntity)
    private discountRepository: Repository<DiscountEntity>,
  ) {
    super(discountRepository);
  }

  async checkDiscountCode(data: number): Promise<DiscountEntity> {
    const findDisount = await this.getOneById(data);
    if (findDisount) {
      return findDisount;
    } else {
      throw Error('Discount In Valid');
    }
  }
}
