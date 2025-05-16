import { Test, TestingModule } from '@nestjs/testing';
import { BankDirectoryService } from './bank-directory.service';

describe('BankDirectoryService', () => {
  let service: BankDirectoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankDirectoryService],
    }).compile();

    service = module.get<BankDirectoryService>(BankDirectoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
