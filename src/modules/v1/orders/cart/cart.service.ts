import { Injectable } from '@nestjs/common';
import { CartDto } from './cart-dto/cart.dto';
import { ICartService } from './cart.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from './cart.entity';
import { AbstractBaseService } from 'src/common/bases/base.abstract.service';

@Injectable()
export class CartService extends AbstractBaseService<CartDto> implements ICartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartDto>,
  ) {
    super(cartRepository);
  }
}
