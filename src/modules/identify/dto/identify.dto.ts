export class IdentifyRequestDto {
  email?: string;
  phoneNumber?: string;
}

export class IdentifyContactResponse {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

export class IdentifyResponseDto {
  contact: IdentifyContactResponse;
}
