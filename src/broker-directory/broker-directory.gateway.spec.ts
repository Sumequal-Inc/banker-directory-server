import { Test, TestingModule } from '@nestjs/testing';
import { BrokerDirectoryGateway } from './broker-directory.controller';
import { BrokerDirectoryService } from './broker-directory.service';

describe('BrokerDirectoryGateway', () => {
  let gateway: BrokerDirectoryGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrokerDirectoryGateway, BrokerDirectoryService],
    }).compile();

    gateway = module.get<BrokerDirectoryGateway>(BrokerDirectoryGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
