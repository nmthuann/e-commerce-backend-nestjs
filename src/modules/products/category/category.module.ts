import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
@Module({
    imports:[
       TypeOrmModule.forFeature([CategoryEntity])
    ],
    controllers: [CategoryController],
    providers: [
        {
            provide: 'ICategoryService',
            useClass: CategoryService,
        },
    ],
    exports: ['ICategoryService',]
})
export class CategoryModule {}