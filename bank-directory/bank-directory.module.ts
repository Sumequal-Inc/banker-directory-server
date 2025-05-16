import { Module } from '@nestjs/common';
import { BankDirectoryService } from './bank-directory.service';
import { BankDirectoryController } from './bank-directory.controller';

@Module({
  controllers: [BankDirectoryController],
  providers: [BankDirectoryService],
})
export class BankDirectoryModule {}
