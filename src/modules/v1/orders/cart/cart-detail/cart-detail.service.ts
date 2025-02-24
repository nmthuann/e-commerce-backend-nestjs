import { Injectable } from '@nestjs/common';
import { CartDetailDto } from '../cart-dto/cart-detail.dto';
import { ICartDetailService } from './cart-detail.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CartDetailEntity } from '../cart-detail.entity';
import { Repository } from 'typeorm';
import { AbstractBaseService } from 'src/modules/v1/bases/base.abstract.service';

@Injectable()
export class CartDetailService
  extends AbstractBaseService<CartDetailDto>
  implements ICartDetailService
{
  constructor(
    @InjectRepository(CartDetailEntity)
    private cartDetailRepository: Repository<CartDetailDto>,
  ) {
    super(cartDetailRepository);
  }
}
