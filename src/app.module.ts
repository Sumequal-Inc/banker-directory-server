import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankerService } from './banker-profile/banker.service';
import { BankerModule } from './banker-profile/banker.module';
import { LenderModule } from './lender/lender.module';
import { BankDirectoryModule } from './bank-directory/bank-directory.module';
import { BrokerDirectoryModule } from './broker-directory/broker-directory.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    UserModule,
    AuthModule,
    BankerModule,
    LenderModule,
    BankDirectoryModule,
    BrokerDirectoryModule,
    ContactModule
 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}