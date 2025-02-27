import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SupplierEntity } from './supplier.entity'
import { SupplierService } from './supplier.service'
import { SupplierController } from './supplier.controller'

@Module({
  imports: [TypeOrmModule.forFeature([SupplierEntity])],
  controllers: [SupplierController],
  providers: [
    {
      provide: 'ISupplierService',
      useClass: SupplierService
    }
  ],
  exports: ['ISupplierService']
})
export class SupplierModule {}
