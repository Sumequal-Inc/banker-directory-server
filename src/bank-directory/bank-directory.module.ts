import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankerDirectoryService } from './bank-directory.service';
import { BankerDirectoryController } from './bank-directory.controller';
import { BankerDirectory, BankerDirectorySchema } from './schemas/bank-directory.schema';
import { BankerDirectoryReview, BankerDirectoryReviewSchema } from './schemas/banker_directory_review.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
   imports: [
      MulterModule.register({}), 
    MongooseModule.forFeature([
      { name: BankerDirectory.name, schema: BankerDirectorySchema },
      { name: BankerDirectoryReview.name, schema: BankerDirectoryReviewSchema },

    ]),
  ],
  controllers: [BankerDirectoryController],
  providers: [BankerDirectoryService],
})
export class BankDirectoryModule {}
