import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from './discount.entity';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
@Module({
  imports: [TypeOrmModule.forFeature([DiscountEntity])],
  controllers: [DiscountController],
  providers: [
    {
      provide: 'IDiscountService',
      useClass: DiscountService,
    },
  ],
  exports: ['IDiscountService'],
})
export class DiscountModule {}
