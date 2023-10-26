import { BaseService } from 'src/modules/bases/base.abstract';
import { IShippingService } from './shipping.service.interface';
import { ShippingDto } from './shipping.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingEntity } from './shipping.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShippingService
  extends BaseService<ShippingDto>
  implements IShippingService
{
  constructor(
    @InjectRepository(ShippingEntity)
    private shippingRepository: Repository<ShippingDto>,
  ) {
    super(shippingRepository);
  }
}
