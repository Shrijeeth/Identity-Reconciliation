import { RequiredProperties } from 'src/types/types';
import { Contact } from '../entities/contact.entity';

export type CreateContact = RequiredProperties<Contact, 'linkPrecedence'> & {
  linkedId?: number;
  email?: string;
  phoneNumber?: string;
};

export type UpdateContact = Partial<CreateContact> & { id: number };
