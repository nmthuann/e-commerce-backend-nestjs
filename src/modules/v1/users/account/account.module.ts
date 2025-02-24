import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './account.entity';

import { AccountService } from './account.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [
    // {
    //   provide: 'IAccountService',
    //   useClass: AccountService,
    // },
  ],
  // exports: ['IAccountService'],
})
export class AccountModule {}
