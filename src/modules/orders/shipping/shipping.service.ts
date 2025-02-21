import { IShippingService } from './shipping.service.interface';
import { ShippingDto } from './shipping.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingEntity } from './shipping.entity';
import { Repository } from 'typeorm';
import { AbstractBaseService } from 'src/common/bases/base.abstract.service';

@Injectable()
export class ShippingService
  extends AbstractBaseService<ShippingDto>
  implements IShippingService
{
  constructor(
    @InjectRepository(ShippingEntity)
    private readonly shippingRepository: Repository<ShippingDto>,
  ) {
    super(shippingRepository);
  }
}
