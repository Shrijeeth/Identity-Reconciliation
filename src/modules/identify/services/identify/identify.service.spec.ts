import { Test, TestingModule } from '@nestjs/testing';
import { IdentifyService } from './identify.service';
import { ContactService } from '../contact/contact.service';
import { contactProviders } from '../../repository/contact/contact.providers';

describe('IdentifyService', () => {
  let service: IdentifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdentifyService, ContactService, ...contactProviders],
    }).compile();

    service = module.get<IdentifyService>(IdentifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
