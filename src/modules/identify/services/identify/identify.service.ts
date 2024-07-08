import { Injectable } from '@nestjs/common';
import { ContactService } from '../contact/contact.service';
import { IdentifyDto } from '../../dto/identify.dto';
import {
  CreateContact,
  IdentifyResponse,
  UpdateContact,
} from '../../utils/types';
import { Contact } from '../../entities/contact.entity';
@Injectable()
export class IdentifyService {
  constructor(private readonly contactService: ContactService) {}

  /**
   * Formats the secondary contacts based on the provided primary contact.
   * Retrieves the secondary contacts by their linked ID and formats them.
   *
   * @param {Contact} primaryContact - The primary contact to format the secondary contacts for.
   * @return {Promise<IdentifyResponse>} A promise that resolves to the formatted secondary contacts.
   */
  async formatSecondaryContacts(
    primaryContact: Contact,
  ): Promise<IdentifyResponse> {
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

    const result: IdentifyResponse = {
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
   * @return {Promise<IdentifyResponse>} A promise that resolves to the formatted identify response.
   */
  async formatIdentifyResponse(contact: Contact): Promise<IdentifyResponse> {
    if (contact.linkPrecedence === 'secondary') {
      const primaryContact = await this.contactService.getContactById(
        contact.linkedId,
      );

      if (!primaryContact) {
        throw new Error('Primary contact not found');
      }
      return await this.formatSecondaryContacts(primaryContact);
    }

    return await this.formatSecondaryContacts(contact);
  }

  /**
   * Identifies and Updates contact based on the provided phone number and email.
   *
   * @param {IdentifyDto} identifyDto - The DTO containing the phone number and email.
   * @return {Promise<Contact>} A Promise that resolves to the identified contact.
   * @throws {Error} If the identify request is invalid.
   */
  async identify(identifyDto: IdentifyDto): Promise<Contact> {
    const { phoneNumber, email } = identifyDto;

    if (phoneNumber && email) {
      const existingContact = await this.getExistingContact(phoneNumber, email);

      if (existingContact) {
        return existingContact;
      }

      const [dataWithPhoneNumber, dataWithEmail] = await Promise.all([
        this.contactService.getContactsByPhoneNumber(phoneNumber),
        this.contactService.getContactsByEmail(email),
      ]);

      if (dataWithPhoneNumber.length && dataWithEmail.length) {
        await this.updateContacts(dataWithPhoneNumber, dataWithEmail);
        return dataWithPhoneNumber[0];
      } else if (dataWithPhoneNumber.length) {
        return await this.createContactWithPhoneNumber(
          dataWithPhoneNumber,
          email,
        );
      } else if (dataWithEmail.length) {
        return await this.createContactWithEmail(dataWithEmail, phoneNumber);
      }

      return await this.createNewContact(phoneNumber, email);
    } else if (phoneNumber) {
      const dataWithPhoneNumber =
        await this.contactService.getContactsByPhoneNumber(phoneNumber);
      if (dataWithPhoneNumber.length) {
        return dataWithPhoneNumber[0];
      }
      return await this.createNewContact(phoneNumber);
    } else if (email) {
      const dataWithEmail = await this.contactService.getContactsByEmail(email);
      if (dataWithEmail.length) {
        return dataWithEmail[0];
      }
      return await this.createNewContact(undefined, email);
    }

    throw new Error('Invalid identify request');
  }

  /**
   * Retrieves an existing contact based on the provided phone number and email.
   *
   * @param {string} phoneNumber - The phone number of the contact.
   * @param {string} email - The email of the contact.
   * @return {Promise<Contact | undefined>} A Promise that resolves to the existing contact, or undefined if no contact is found.
   */
  private async getExistingContact(
    phoneNumber: string,
    email: string,
  ): Promise<Contact | undefined> {
    const existingContacts =
      await this.contactService.getContactsByPhoneNumberAndEmail({
        phoneNumber,
        email,
      });
    return existingContacts.length ? existingContacts[0] : undefined;
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
    const updatedContact: UpdateContact = {
      id: dataWithPhoneNumber[0].id,
      linkPrecedence: 'secondary',
      linkedId: dataWithEmail[0].id,
    };
    return await this.contactService.updateContactById(updatedContact);
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
    const insertedContact: CreateContact = {
      email,
      phoneNumber: dataWithPhoneNumber[0].phoneNumber,
      linkPrecedence: 'secondary',
      linkedId: dataWithPhoneNumber[0].id,
    };
    return await this.contactService.createContact(insertedContact);
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
    const insertedContact: CreateContact = {
      email: dataWithEmail[0].email,
      phoneNumber,
      linkPrecedence: 'secondary',
      linkedId: dataWithEmail[0].id,
    };
    return await this.contactService.createContact(insertedContact);
  }

  /**
   * Creates a new contact with the provided phone number and email.
   *
   * @param {string} [phoneNumber] - The phone number of the contact.
   * @param {string} [email] - The email of the contact.
   * @return {Promise<Contact>} A Promise that resolves to the newly created Contact object.
   */
  private async createNewContact(
    phoneNumber?: string,
    email?: string,
  ): Promise<Contact> {
    const insertedContact: CreateContact = {
      email,
      phoneNumber,
      linkPrecedence: 'primary',
    };
    return await this.contactService.createContact(insertedContact);
  }
}
