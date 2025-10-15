import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrokerDirectoryController } from './broker-directory.controller';
import { BrokerDirectoryService } from './broker-directory.service';
import { BrokerDirectory, BrokerDirectorySchema } from './schemas/broker-directory.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: BrokerDirectory.name, schema: BrokerDirectorySchema }])],
  controllers: [BrokerDirectoryController],
  providers: [BrokerDirectoryService],
})
export class BrokerDirectoryModule {}
