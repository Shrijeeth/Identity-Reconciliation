import { CONTACT_REPOSITORY } from '../../types/constants';
import { Contact } from '../../entities/contact.entity';

export const contactProviders = [
  {
    provide: CONTACT_REPOSITORY,
    useValue: Contact,
  },
];
