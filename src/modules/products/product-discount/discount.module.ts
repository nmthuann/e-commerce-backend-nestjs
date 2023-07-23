import { Module,} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from './Discount.entity';
import { DiscountService } from './Discount.service';
import { DiscountController } from './Discount.controller';
@Module({
    imports:[
       TypeOrmModule.forFeature([DiscountEntity])
    ],
    controllers: [DiscountController],
    providers: [
        {
            provide: 'IDiscountService',
            useClass: DiscountService,
        },
    ],
    exports: ['IDiscountService',]
})
export class DiscountModule {}