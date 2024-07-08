import { Injectable } from '@nestjs/common';
import { ContactService } from '../contact/contact.service';
import {
  IdentifyRequestDto,
  IdentifyResponseDto,
} from '../../dto/identify.dto';
import { CreateContact, UpdateContact } from '../../types/types';
import { Contact } from '../../entities/contact.entity';
@Injectable()
export class IdentifyService {
  constructor(private readonly contactService: ContactService) {}

  /**
   * Fetches the secondary contacts based on the provided primary contact.
   * Retrieves the secondary contacts by their linked ID and formats them.
   *
   * @param {Contact} primaryContact - The primary contact to format the secondary contacts for.
   * @return {Promise<IdentifyResponseDto>} A promise that resolves to the formatted secondary contacts.
   */
  async fetchSecondaryContacts(
    primaryContact: Contact,
  ): Promise<IdentifyResponseDto> {
    const secondaryContacts = await this.contactService.getSecondaryContacts(
      primaryContact.id,
    );

    const emailSet = new Set<string>();
    const phoneNumbersSet = new Set<string>();
    if (primaryContact.email) {
      emailSet.add(primaryContact.email);
    }
    if (primaryContact.phoneNumber) {
      phoneNumbersSet.add(primaryContact.phoneNumber);
    }

    secondaryContacts.forEach((contact) => {
      if (contact.email) {
        emailSet.add(contact.email);
      }
      if (contact.phoneNumber) {
        phoneNumbersSet.add(contact.phoneNumber);
      }
    });
    const emails = Array.from(emailSet);
    const phoneNumbers = Array.from(phoneNumbersSet);

    const result: IdentifyResponseDto = {
      contact: {
        primaryContactId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds: secondaryContacts.map((contact) => contact.id),
      },
    };

    return result;
  }

  /**
   * Formats the identify response based on the provided contact.
   * If the contact has a secondary link precedence, it retrieves the contact by its linked ID.
   * Then, it formats the secondary contacts and returns the identify response.
   *
   * @param {Contact} contact - The contact to format the identify response for.
   * @return {Promise<IdentifyResponseDto>} A promise that resolves to the formatted identify response.
   * @throws {Error} If the primary contact is not found.
   */
  async fetchIdentifyResponse(contact: Contact): Promise<IdentifyResponseDto> {
    if (contact.linkPrecedence === 'secondary') {
      const primaryContact = await this.contactService.getContactById(
        contact.linkedId,
      );

      if (!primaryContact) {
        throw new Error('Primary contact not found');
      }
      return await this.fetchSecondaryContacts(primaryContact);
    }

    return this.fetchSecondaryContacts(contact);
  }

  /**
   * Fetches the identify data based on the provided IdentifyRequestDto.
   *
   * @param {IdentifyRequestDto} identifyDto - The IdentifyRequestDto containing the phone number and email.
   * @return {Promise<IdentifyResponseDto>} A promise that resolves to the IdentifyResponseDto containing the identify data.
   */
  async getIdentifyData(identifyDto: IdentifyRequestDto) {
    const data = await this.identify(identifyDto);
    return this.fetchIdentifyResponse(data);
  }

  /**
   * Identifies a contact based on the provided phone number and email.
   *
   * @param {IdentifyRequestDto} identifyDto - The request DTO containing the phone number and email.
   * @return {Promise<Contact>} A promise that resolves to the identified contact.
   * @throws {Error} If the identify request is invalid.
   */
  async identify(identifyDto: IdentifyRequestDto): Promise<Contact> {
    const { phoneNumber, email } = identifyDto;

    if (!phoneNumber && !email) {
      throw new Error('Invalid identify request');
    }

    const existingContact = await this.getExistingContact(phoneNumber, email);
    if (existingContact) {
      return existingContact;
    }

    const contactsByPhoneNumber =
      await this.contactService.getContactsByPhoneNumber(phoneNumber);
    const contactsByEmail = await this.contactService.getContactsByEmail(email);

    if (contactsByPhoneNumber.length && contactsByEmail.length) {
      return this.updateContacts(contactsByPhoneNumber, contactsByEmail);
    } else if (contactsByPhoneNumber.length) {
      return this.createContactWithPhoneNumber(contactsByPhoneNumber, email);
    } else if (contactsByEmail.length) {
      return this.createContactWithEmail(contactsByEmail, phoneNumber);
    }

    return this.createNewContact({
      phoneNumber,
      email,
    });
  }

  /**
   * Retrieves an existing contact based on the provided phone number and email.
   *
   * @param {string} phoneNumber - The phone number of the contact.
   * @param {string} email - The email of the contact.
   * @return {Promise<Contact>} A Promise that resolves to the existing contact.
   */
  private async getExistingContact(
    phoneNumber: string,
    email: string,
  ): Promise<Contact> {
    const existingContacts =
      await this.contactService.getContactsByPhoneNumberAndEmail({
        phoneNumber,
        email,
      });
    return existingContacts[0];
  }

  /**
   * Updates contacts based on phone number and email data.
   *
   * @param {Contact[]} dataWithPhoneNumber - An array of contacts with phone numbers.
   * @param {Contact[]} dataWithEmail - An array of contacts with email addresses.
   * @return {Promise<Contact>} A Promise that resolves to the updated Contact object.
   */
  private async updateContacts(
    dataWithPhoneNumber: Contact[],
    dataWithEmail: Contact[],
  ): Promise<Contact> {
    const linkedId =
      dataWithEmail[0].linkPrecedence === 'secondary'
        ? dataWithEmail[0].linkedId
        : dataWithEmail[0].id;
    const updatedContact: UpdateContact = {
      id: dataWithPhoneNumber[0].id,
      linkPrecedence: 'secondary',
      linkedId,
    };
    return this.contactService.updateContactById(updatedContact);
  }

  /**
   * Creates a new contact with the provided email and associates it with a secondary link precedence.
   *
   * @param {Contact[]} dataWithPhoneNumber - An array of Contact objects containing phone number information.
   * @param {string} email - The email to associate with the new contact.
   * @return {Promise<Contact>} A Promise that resolves to the newly created Contact object.
   */
  private async createContactWithPhoneNumber(
    dataWithPhoneNumber: Contact[],
    email: string,
  ): Promise<Contact> {
    const linkedId =
      dataWithPhoneNumber[0].linkPrecedence === 'secondary'
        ? dataWithPhoneNumber[0].linkedId
        : dataWithPhoneNumber[0].id;
    const insertedContact: CreateContact = {
      email,
      phoneNumber: dataWithPhoneNumber[0].phoneNumber,
      linkPrecedence: 'secondary',
      linkedId,
    };
    return this.contactService.createContact(insertedContact);
  }

  /**
   * Creates a new contact with email and a secondary link precedence.
   *
   * @param {Contact[]} dataWithEmail - An array of Contact objects containing email information.
   * @param {string} phoneNumber - The phone number to associate with the new contact.
   * @return {Promise<Contact>} A Promise that resolves to the newly created Contact object.
   */
  private async createContactWithEmail(
    dataWithEmail: Contact[],
    phoneNumber: string,
  ): Promise<Contact> {
    const linkedId =
      dataWithEmail[0].linkPrecedence === 'secondary'
        ? dataWithEmail[0].linkedId
        : dataWithEmail[0].id;
    const insertedContact: CreateContact = {
      email: dataWithEmail[0].email,
      phoneNumber,
      linkPrecedence: 'secondary',
      linkedId,
    };
    return this.contactService.createContact(insertedContact);
  }

  /**
   * Creates a new contact with the provided phone number and email.
   *
   * @param {Object} options - The options for creating a new contact.
   * @param {string} [options.phoneNumber] - The phone number of the contact.
   * @param {string} [options.email] - The email of the contact.
   * @return {Promise<Contact>} A Promise that resolves to the newly created Contact object.
   */
  private async createNewContact({
    phoneNumber,
    email,
  }: {
    phoneNumber?: string;
    email?: string;
  }): Promise<Contact> {
    const insertedContact: CreateContact = {
      email,
      phoneNumber,
      linkPrecedence: 'primary',
    };
    return this.contactService.createContact(insertedContact);
  }
}
