import { Address } from "./address";
import { Category } from "./category";
import { EntryModel } from "./common";
import { Payment } from "./payment";

export interface Tax {
  rate: number;
  cost: number;
}

export interface Business extends EntryModel {
  name: string;
  email: string;
  website: string;
  tax: Tax;
  address: Address;
  payments: Payment[];
  user: string;
}

export interface BusinessRequest {
  name: string;
  email: string;
  website: string;
  tax: Tax;
  address?: Address;
  payments?: string[];
  user?: string;
}

export interface BusinessTaxRequest {
  tax: Tax;
}
