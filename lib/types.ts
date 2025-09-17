
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      companyId: string | null;
      companyName: string | null;
      firstName: string;
      lastName: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
    companyId: string | null;
    companyName: string | null;
    firstName: string;
    lastName: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    companyId: string | null;
    companyName: string | null;
    firstName: string;
    lastName: string;
  }
}

// Application types
export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'USER';
  isActive: boolean;
  companyId: string | null;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactList {
  id: string;
  name: string;
  description?: string;
  fileName?: string;
  fileUrl?: string;
  totalContacts: number;
  validContacts: number;
  companyId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  customFields?: any;
  isValid: boolean;
  contactListId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  message: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED' | 'PAUSED';
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  creditsUsed: number;
  companyId: string;
  contactListId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditTransaction {
  id: string;
  type: 'PURCHASE' | 'USAGE' | 'REFUND' | 'ADJUSTMENT';
  amount: number;
  balance: number;
  description: string;
  reference?: string;
  companyId: string;
  createdAt: Date;
}
