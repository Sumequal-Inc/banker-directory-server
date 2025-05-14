import { Test, TestingModule } from '@nestjs/testing';
import { LenderController } from './lender.controller';
import { LenderService } from './lender.service';

describe('LenderController', () => {
  let controller: LenderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LenderController],
      providers: [LenderService],
    }).compile();

    controller = module.get<LenderController>(LenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
