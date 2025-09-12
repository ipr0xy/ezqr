export const APP_CONFIG = {
  name: 'EZ QR',
  description: 'Create and Manage UPI QR Code',
  version: '1.0.0',
  author: 'pr0xy'
} as const;

export const STORAGE_KEYS = {
  ITEMS: 'qr-ez-items-storage',
  PREFERENCES: 'qr-ez-preferences'
} as const;

export const UPI_CONFIG = {
  currency: 'INR',
  protocol: 'upi://pay',
  maxAmount: 100000, // ₹1,00,000 limit
  minAmount: 1 // ₹1 minimum
} as const;

export const QR_CODE_CONFIG = {
  size: 200,
  level: 'M' as const,
  includeMargin: true,
  backgroundColor: '#ffffff',
  foregroundColor: '#000000'
} as const;

export const VALIDATION_RULES = {
  upiId: {
    pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/,
    maxLength: 50
  },
  itemName: {
    minLength: 1,
    maxLength: 100
  },
  description: {
    maxLength: 200
  },
  paymentNote: {
    maxLength: 100
  }
} as const;

export const ERROR_MESSAGES = {
  INVALID_UPI: 'Invalid UPI ID format (e.g., user@bank)',
  REQUIRED_FIELD: 'This field is required',
  INVALID_AMOUNT: 'Please enter a valid amount',
  AMOUNT_TOO_LOW: `Minimum amount is ₹${UPI_CONFIG.minAmount}`,
  AMOUNT_TOO_HIGH: `Maximum amount is ₹${UPI_CONFIG.maxAmount}`,
  NAME_TOO_LONG: `Name must be less than ${VALIDATION_RULES.itemName.maxLength} characters`,
  DESCRIPTION_TOO_LONG: `Description must be less than ${VALIDATION_RULES.description.maxLength} characters`,
  PAYMENT_NOTE_TOO_LONG: `Payment note must be less than ${VALIDATION_RULES.paymentNote.maxLength} characters`,
  UPI_TOO_LONG: `UPI ID must be less than ${VALIDATION_RULES.upiId.maxLength} characters`,
  GENERIC_ERROR: 'An error occurred. Please try again.'
} as const;