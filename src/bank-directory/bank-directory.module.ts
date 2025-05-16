import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankerDirectoryService } from './bank-directory.service';
import { BankerDirectoryController } from './bank-directory.controller';
import { BankerDirectory, BankerDirectorySchema } from './schemas/bank-directory.schema';

@Module({
   imports: [
    MongooseModule.forFeature([
      { name: BankerDirectory.name, schema: BankerDirectorySchema },
    ]),
  ],
  controllers: [BankerDirectoryController],
  providers: [BankerDirectoryService],
})
export class BankDirectoryModule {}
