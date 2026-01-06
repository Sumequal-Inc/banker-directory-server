import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankerDirectoryController } from './bank-directory.controller';
import { BankerDirectoryService } from './bank-directory.service';
import { BankerDirectory, BankerDirectorySchema } from './schemas/bank-directory.schema';
import { BankerDirectoryReview, BankerDirectoryReviewSchema } from './schemas/banker_directory_review.schema';
import { JwtModule } from '@nestjs/jwt'; // ✅ yeh add karo
import { AuthModule } from '../auth/auth.module'; // ✅ yahan se JwtService aayega

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BankerDirectory.name, schema: BankerDirectorySchema },
      { name: BankerDirectoryReview.name, schema: BankerDirectoryReviewSchema },
    ]),
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultsecret', 
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [BankerDirectoryController],
  providers: [BankerDirectoryService],
})
export class BankDirectoryModule {}
