import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageEntity } from "./image.entity";
import { ImageController } from "./image.controller";
import { ImageService } from "./image.service";

@Module({
    imports:[
       TypeOrmModule.forFeature([ImageEntity])
    ],
    controllers: [ImageController],
    providers: [
        {
            provide: 'IImageService',
            useClass: ImageService,
        },
    ],
    exports: ['IImageService',]
})
export class ImageModule {}