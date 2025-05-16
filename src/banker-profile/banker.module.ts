import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankerController } from './banker.controller';
import { BankerService } from './banker.service';
import { Banker, BankerSchema } from './schemas/banker.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Banker.name, schema: BankerSchema },
    ]),
  ],
  controllers: [BankerController],
  providers: [BankerService],
})
export class BankerModule {}
