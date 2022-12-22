import {Category} from './category';
import {Client} from './client';
import {EntryModel} from './common';
import {Payment} from './payment';

export enum InvoiceStatus {
  Estimate = 'Estimate',
  Unpaid = 'Unpaid',
  Paid = 'Paid',
}

export interface InvoiceDelivery {
  email: string;
  text: string;
  sharedLink: string;
}

export interface InvoiceCustom {
  name: string;
  description: string;
}

export interface InvoiceItem {
  description: string;
  rate: number;
  hours: number;
}

export interface Invoice extends EntryModel {
  token: string;
  reference: number;
  number: string;
  date: string;
  dueDate: string;
  recurringPeriod: number;
  delivery: InvoiceDelivery;
  items: InvoiceItem[];
  customs: InvoiceCustom[];
  billTo?: Client;
  payments: Payment[];
  category: Category;
  tax: number;
  taxRate: number;
  discount: number;
  discountRate: number;
  subTotal: number;
  total: number;
  attachments: string[];
  status: InvoiceStatus;
  paypalId?: string;
}

export interface InvoiceRequest {
  number: string;
  date: string;
  dueDate: string;
  recurringPeriod: number;
  delivery: InvoiceDelivery;
  items: InvoiceItem[];
  customs: InvoiceCustom[];
  billTo: string;
  payments: string[];
  category: string;
  tax: number;
  taxRate: number;
  discount: number;
  discountRate: number;
  subTotal: number;
  total: number;
  attachments: string[];
  status: InvoiceStatus;
}

export interface InvoiceDate {
  date: string;
  dueDate: string;
  recurringPeriod: number;
}

export interface InvoiceDetail {
  items: InvoiceItem[];
  category: Category;
  tax: number;
  taxRate: number;
  discount: number;
  discountRate: number;
  subTotal: number;
  total: number;
}

export interface CategoryOverview {
  _id: string;
  category: Category;
  sum: number;
}

export interface BalanceOverview {
  _id: InvoiceStatus;
  sum: number;
}

export interface ClientOverview {
  _id: string;
  client: Client;
  sum: number;
}

export interface DateOverview {
  _id: string;
  client: {
    name: string;
  };
  number: string;
  date: string;
  dueDate: string;
  total: number;
  status: InvoiceStatus;
}

export interface InvoicesCount {
  count: number;
}

export interface InvoiceFilter {
  clients: string[];
  categories: string[];
  amount:
    | {
        min: number;
        max: number;
      }
    | undefined;
  range:
    | {
        start: string;
        end: string | null;
      }
    | undefined;
}
