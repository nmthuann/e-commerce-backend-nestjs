import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionEntity } from './position.entity';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';

@Module({
  imports: [TypeOrmModule.forFeature([PositionEntity])],
  controllers: [PositionController],
  providers: [
    {
      provide: 'IPositionService',
      useClass: PositionService,
    },
  ],
  exports: ['IPositionService'],
})
export class PositionModule {}
