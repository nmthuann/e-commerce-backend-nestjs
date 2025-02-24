import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AccountModule } from '../account/account.module';

import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
   
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: 'JWT_SECRET_KEY',
      signOptions: { expiresIn: 60 },
    }),
    AccountModule,
    // AuthModule
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },


  ],
  exports: ['IUserService'],
})
export class UserModule {}
