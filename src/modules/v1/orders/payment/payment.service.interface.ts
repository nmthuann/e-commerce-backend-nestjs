import { IBaseService } from 'src/common/bases/base.interface';
import { PaymentDto } from './payment.dto';

export type IPaymentService = IBaseService<PaymentDto>;
