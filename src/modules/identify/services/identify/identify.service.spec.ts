import { Test, TestingModule } from '@nestjs/testing';
import { IdentifyService } from './identify.service';

describe('IdentifyService', () => {
  let service: IdentifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdentifyService],
    }).compile();

    service = module.get<IdentifyService>(IdentifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
