import {ActiveStatus, EntryModel, HumanName} from './common';

export enum UserRole {
  Admin = 'Admin',
  Customer = 'Customer',
}

export interface User extends EntryModel {
  name: HumanName;
  email: string;
  phoneNumber: string;
  imageUrl: string;
  role: UserRole;
  lastLogin: string;
  subscription: string;
  subscriptionEndAt: Date;
  status: ActiveStatus;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  password: string;
}
