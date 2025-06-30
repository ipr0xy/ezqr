export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  createdAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  upiId: string;
  ownerId: string;
  createdAt: Date;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  organizationId: string;
  paymentNote: string;
  qrCodeData: string;
  upiId: string;
  createdAt: Date;
  isActive: boolean;
}

export interface Payment {
  id: string;
  itemId: string;
  buyerName?: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
}

export interface UPIQRData {
  pa: string; // UPI ID
  pn: string; // Payee Name
  am: string; // Amount
  tn: string; // Transaction Note
  cu: string; // Currency
}

// Additional utility types for better type safety
export type ItemFormData = Omit<Item, 'id' | 'createdAt' | 'qrCodeData' | 'isActive' | 'organizationId'>;
export type ItemUpdateData = Partial<Omit<Item, 'id' | 'createdAt'>>;
export type CreateItemData = Omit<Item, 'id' | 'createdAt' | 'qrCodeData' | 'isActive'>;