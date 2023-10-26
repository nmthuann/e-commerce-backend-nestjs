import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/bases/base.abstract';
import { CartDetailDto } from '../cart-dto/cart-detail.dto';
import { ICartDetailService } from './cart-detail.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CartDetailEntity } from '../cart-detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartDetailService
  extends BaseService<CartDetailDto>
  implements ICartDetailService
{
  constructor(
    @InjectRepository(CartDetailEntity)
    private cartDetailRepository: Repository<CartDetailDto>,
  ) {
    super(cartDetailRepository);
  }
}
