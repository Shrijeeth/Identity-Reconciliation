import { Inject, Injectable } from '@nestjs/common';
import { Contact } from '../../entities/contact.entity';
import { CONTACT_REPOSITORY } from '../../constants';

@Injectable()
export class ContactService {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepository: typeof Contact,
  ) {}

  async getContactsByPhoneNumberAndEmail({
    phoneNumber,
    email,
  }: {
    phoneNumber?: string;
    email?: string;
  }) {
    return await this.contactRepository.findOne({
      where: { phoneNumber, email },
    });
  }

  async getContactsByPhoneNumber(phoneNumber: string) {
    return await this.contactRepository.findOne({ where: { phoneNumber } });
  }

  async getContactsByEmail(email: string) {
    return await this.contactRepository.findOne({ where: { email } });
  }

  async createContact(contact: Contact) {
    return await this.contactRepository.create(contact);
  }

  async updateContact(contact: Contact) {
    return await this.contactRepository.update(contact, {
      where: { id: contact.id },
    });
  }
}
