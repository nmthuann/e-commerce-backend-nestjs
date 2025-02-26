import { Injectable } from '@nestjs/common';
import { PaymentDto } from './payment.dto';
import { IPaymentService } from './payment.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './payment.entity';
import { Repository } from 'typeorm';
import { AbstractBaseService } from 'src/modules/v1/bases/base.abstract.service';

@Injectable()
export class PaymentService
  extends AbstractBaseService<PaymentDto>
  implements IPaymentService
{
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentDto>,
  ) {
    super(paymentRepository);
  }
}
