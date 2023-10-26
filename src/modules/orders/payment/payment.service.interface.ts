import { IBaseService } from 'src/modules/bases/base.interface';
import { PaymentDto } from './payment.dto';

export type IPaymentService = IBaseService<PaymentDto>;
