import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from './discount.entity';
import { Repository } from 'typeorm';
import { IDiscountService } from './discount.service.interface';
import { AbstractBaseService } from 'src/modules/v1/bases/base.abstract.service';

@Injectable()
export class DiscountService
  extends AbstractBaseService<DiscountEntity>
  implements IDiscountService
{
  constructor(
    @InjectRepository(DiscountEntity)
    private readonly discountRepository: Repository<DiscountEntity>,
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
