import { CONTACT_REPOSITORY } from '../../utils/constants';
import { Contact } from '../../entities/contact.entity';

export const contactProviders = [
  {
    provide: CONTACT_REPOSITORY,
    useValue: Contact,
  },
];
