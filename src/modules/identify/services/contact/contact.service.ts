import { Inject, Injectable } from '@nestjs/common';
import { Contact } from '../../entities/contact.entity';
import { CONTACT_REPOSITORY } from '../../types/constants';
import { CreateContact, UpdateContact } from '../../types/types';

@Injectable()
export class ContactService {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepository: typeof Contact,
  ) {}

  /**
   * Retrieves contacts by phone number and email.
   *
   * @param {Object} params - The parameters for the function.
   * @param {string} params.phoneNumber - The phone number of the contacts.
   * @param {string} params.email - The email of the contacts.
   * @return {Promise<Array<Contact>>} A promise that resolves to an array of contacts.
   */
  async getContactsByPhoneNumberAndEmail({
    phoneNumber,
    email,
  }: {
    phoneNumber: string;
    email: string;
  }): Promise<Array<Contact>> {
    return this.contactRepository.findAll({
      where: { phoneNumber, email },
    });
  }

  /**
   * Retrieves contacts by phone number.
   *
   * @param {string} phoneNumber - The phone number of the contacts.
   * @return {Promise<Contact[]>} A promise that resolves to an array of contacts.
   */
  async getContactsByPhoneNumber(phoneNumber: string): Promise<Contact[]> {
    return this.contactRepository.findAll({ where: { phoneNumber } });
  }

  /**
   * Retrieves contacts by email.
   *
   * @param {string} email - The email of the contacts.
   * @return {Promise<Contact[]>} A promise that resolves to an array of contacts.
   */
  async getContactsByEmail(email: string): Promise<Contact[]> {
    return this.contactRepository.findAll({ where: { email } });
  }

  /**
   * Creates a new contact in the contact repository.
   *
   * @param {CreateContact} contact - The contact object containing the information to create a new contact.
   * @return {Promise<Contact>} A promise that resolves to the newly created contact.
   */
  async createContact(contact: CreateContact): Promise<Contact> {
    return this.contactRepository.create(contact, {
      returning: true,
    });
  }

  /**
   * Updates a contact by its ID.
   *
   * @param {UpdateContact} contact - The contact object containing the updated information.
   * @return {Promise<Contact>} A promise that resolves to the updated contact.
   */
  async updateContactById(contact: UpdateContact): Promise<Contact> {
    await this.contactRepository.update(contact, {
      where: { id: contact.id },
      returning: true,
    });
    return this.contactRepository.findByPk(contact.id);
  }

  /**
   * Retrieves the secondary contacts associated with a given primary contact.
   *
   * @param {number} primaryContactId - The ID of the primary contact.
   * @return {Promise<Contact[]>} A promise that resolves to an array of secondary contacts.
   */
  async getSecondaryContacts(primaryContactId: number): Promise<Contact[]> {
    return this.contactRepository.findAll({
      where: { linkPrecedence: 'secondary', linkedId: primaryContactId },
    });
  }

  /**
   * Retrieves a contact by its ID.
   *
   * @param {number} contactId - The ID of the contact to retrieve.
   * @return {Promise<Contact | null>} A promise that resolves to the contact with the specified ID, or null if not found.
   */
  async getContactById(contactId: number): Promise<Contact | null> {
    return this.contactRepository.findByPk(contactId);
  }
}
