import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShippingEntity } from "./shipping.entity";
import { ShippingController } from "./shipping.controller";
import { ShippingService } from "./shipping.service";

@Module({
    imports:[
       TypeOrmModule.forFeature([ShippingEntity])
    ],
    controllers: [ShippingController],
    providers: [
        {
            provide: 'IShippingService',
            useClass: ShippingService,
        },
    ],
    exports: ['IShippingService',]
})
export class ShippingModule {}