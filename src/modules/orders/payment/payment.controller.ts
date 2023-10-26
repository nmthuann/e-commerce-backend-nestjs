import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Inject,
} from '@nestjs/common';
import { PaymentDto } from '../payment/payment.dto';
import { IPaymentService } from './payment.service.interface';

// working with DTO
@Controller('payment')
export class PaymentController {
  constructor(
    @Inject('IPaymentService')
    private paymentService: IPaymentService,
  ) {}

  @Post('create')
  async createPayment(@Body() payment: PaymentDto): Promise<PaymentDto> {
    return await this.paymentService.createOne(payment);
  }

  @Put('update/:id')
  async updatePaymentById(
    @Param('id') id: number,
    @Body() paymentDto: PaymentDto,
  ): Promise<PaymentDto> {
    return this.paymentService.updateOneById(id, paymentDto);
  }

  @Delete('delete/:id')
  async deletePaymentById(@Param('id') id: number): Promise<void> {
    console.log(await this.paymentService.deleteOneById(id));
  }

  @Get('get-payments')
  async getPayments(): Promise<PaymentDto[]> {
    return await this.paymentService.getAll();
  }

  @Get(':id')
  async getPayment(@Param('id') id: number): Promise<PaymentDto> {
    return await this.paymentService.getOneById(id);
  }
}
