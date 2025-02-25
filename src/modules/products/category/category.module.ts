import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryEntity])],
    controllers: [CategoryController],
    providers: [
        {
            provide: 'ICategoryService',
            useClass: CategoryService,
        },
    ],
    exports: ['ICategoryService'],
})
export class CategoryModule {}
