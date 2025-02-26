import { IBaseService } from 'src/modules/v1/bases/base.interface';
import { PaymentDto } from './payment.dto';

export type IPaymentService = IBaseService<PaymentDto>;
