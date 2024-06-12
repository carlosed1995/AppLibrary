export interface Phone {
  phone_number: string;
}

export interface Email {
  email: string; 
}

export interface Address {
  address: string;
  city: string;
  state: string;
  postal_code: string; 
}

export interface Contact {
  id: number;
  name: string;
  last_page: number;
  phones: Phone[];  
  emails: Email[];
  addresses: Address[];
}