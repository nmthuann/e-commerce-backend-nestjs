import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/bases/base.abstract';
import { CartDto } from './cart-dto/cart.dto';
import { ICartService } from './cart.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from './cart.entity';

@Injectable()
export class CartService extends BaseService<CartDto> implements ICartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartDto>,
  ) {
    super(cartRepository);
  }
}
