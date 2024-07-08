import { RequiredProperties } from 'src/utils/types';
import { Contact } from '../entities/contact.entity';

export type CreateContact = RequiredProperties<Contact, 'linkPrecedence'> & {
  linkedId?: number;
  email?: string;
  phoneNumber?: string;
};

export type UpdateContact = Partial<CreateContact> & { id: number };

export interface IdentifyContactResponse {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

export interface IdentifyResponse {
  contact: IdentifyContactResponse;
}
