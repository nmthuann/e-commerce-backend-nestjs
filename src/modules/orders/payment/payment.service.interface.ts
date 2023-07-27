import { IBaseService } from "src/modules/bases/base.interface";
import { PaymentDto } from "./payment.dto";

export interface IPaymentService extends IBaseService<PaymentDto> {
}