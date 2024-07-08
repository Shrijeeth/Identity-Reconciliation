import { Test, TestingModule } from '@nestjs/testing';
import { IdentifyController } from './identify.controller';

describe('IdentifyController', () => {
  let controller: IdentifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdentifyController],
    }).compile();

    controller = module.get<IdentifyController>(IdentifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
