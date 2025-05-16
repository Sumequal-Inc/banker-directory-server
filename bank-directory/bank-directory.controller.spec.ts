import { Test, TestingModule } from '@nestjs/testing';
import { BankDirectoryController } from './bank-directory.controller';
import { BankDirectoryService } from './bank-directory.service';

describe('BankDirectoryController', () => {
  let controller: BankDirectoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankDirectoryController],
      providers: [BankDirectoryService],
    }).compile();

    controller = module.get<BankDirectoryController>(BankDirectoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
