import { UPI_CONFIG, ERROR_MESSAGES } from './constants';
import { validateUPIId, validateAmount } from './validation';

export interface UPIQRData {
  pa: string; // UPI ID
  pn: string; // Payee Name
  am: string; // Amount
  tn: string; // Transaction Note
  cu: string; // Currency
}

export const sanitizeString = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[^\w\s.-]/g, '') // Keep only alphanumeric, spaces, dots, and hyphens
    .substring(0, 100); // Limit length
};

export const generatePaymentNote = (itemName: string, customNote?: string): string => {
  if (customNote && customNote.trim()) {
    return sanitizeString(customNote);
  }
  return `Payment for ${sanitizeString(itemName)}`;
};

export const generateUPIQRData = (
  upiId: string, 
  payeeName: string, 
  amount: number, 
  note: string
): string => {
  // Validate inputs
  const upiValidation = validateUPIId(upiId);
  if (!upiValidation.isValid) {
    throw new Error(upiValidation.error || ERROR_MESSAGES.INVALID_UPI);
  }
  
  const amountValidation = validateAmount(amount);
  if (!amountValidation.isValid) {
    throw new Error(amountValidation.error || ERROR_MESSAGES.INVALID_AMOUNT);
  }

  // Sanitize inputs
  const sanitizedPayeeName = sanitizeString(payeeName);
  const sanitizedNote = sanitizeString(note);
  
  if (!sanitizedPayeeName) {
    throw new Error('Payee name is required');
  }
  
  const qrData: UPIQRData = {
    pa: upiId.trim(),
    pn: sanitizedPayeeName,
    am: amount.toFixed(2),
    tn: sanitizedNote || `Payment for ${sanitizedPayeeName}`,
    cu: UPI_CONFIG.currency
  };
  
  const params = new URLSearchParams();
  Object.entries(qrData).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  return `${UPI_CONFIG.protocol}?${params.toString()}`;
};

export const formatCurrency = (amount: number): string => {
  try {
    if (isNaN(amount) || !isFinite(amount)) {
      return '₹0.00';
    }
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  } catch {
    return `₹${amount.toFixed(2)}`;
  }
};

export const parseAmount = (amountString: string): number => {
  const parsed = parseFloat(amountString);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
};