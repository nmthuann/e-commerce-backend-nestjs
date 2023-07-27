import { Injectable } from "@nestjs/common";
import { BaseService } from "src/modules/bases/base.abstract";
import { PaymentDto } from "./payment.dto";
import { IPaymentService } from "./payment.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEntity } from "./payment.entity";
import { Repository } from "typeorm";

@Injectable()
export class PaymentService extends BaseService<PaymentDto> implements IPaymentService{
    constructor(
    @InjectRepository(PaymentEntity) 
    private paymentRepository: Repository<PaymentDto>) {
        super(paymentRepository);
    }
}