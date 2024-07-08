import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { contactProviders } from '../../repository/contact/contact.providers';

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactService, ...contactProviders],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
