import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderDetailEntity } from "../order-detail.entity";
import { OrderDetailController } from "./order-detail.controller";
import { OrderDetailService } from "./order-detail.service";

@Module({
    imports:[
       TypeOrmModule.forFeature([OrderDetailEntity])
    ],
    controllers: [OrderDetailController],
    providers: [
        {
            provide: 'IOrderDetailService',
            useClass: OrderDetailService,
        },
    ],
    exports: ['IOrderDetailService',]
})
export class OrderDetailModule {}