import { Test, TestingModule } from '@nestjs/testing';
import { BrokerDirectoryService } from './broker-directory.service';

describe('BrokerDirectoryService', () => {
  let service: BrokerDirectoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrokerDirectoryService],
    }).compile();

    service = module.get<BrokerDirectoryService>(BrokerDirectoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
