import { VALIDATION_RULES, ERROR_MESSAGES, UPI_CONFIG } from './constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateUPIId = (upiId: string): ValidationResult => {
  if (!upiId || typeof upiId !== 'string') {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
  }
  
  const trimmed = upiId.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
  }
  
  if (trimmed.length > VALIDATION_RULES.upiId.maxLength) {
    return { isValid: false, error: ERROR_MESSAGES.UPI_TOO_LONG };
  }
  
  if (!VALIDATION_RULES.upiId.pattern.test(trimmed)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_UPI };
  }
  
  return { isValid: true };
};

export const validateAmount = (amount: number | string): ValidationResult => {
  // Allow empty amount for manual entry
  if (amount === '' || amount === null || amount === undefined) {
    return { isValid: true };
  }
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount) || numAmount < 0) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_AMOUNT };
  }
  
  if (numAmount > 0 && numAmount < UPI_CONFIG.minAmount) {
    return { isValid: false, error: ERROR_MESSAGES.AMOUNT_TOO_LOW };
  }
  
  if (numAmount > UPI_CONFIG.maxAmount) {
    return { isValid: false, error: ERROR_MESSAGES.AMOUNT_TOO_HIGH };
  }
  
  return { isValid: true };
};

export const validateItemName = (name: string): ValidationResult => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
  }
  
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
  }
  
  if (trimmed.length > VALIDATION_RULES.itemName.maxLength) {
    return { isValid: false, error: ERROR_MESSAGES.NAME_TOO_LONG };
  }
  
  return { isValid: true };
};

export const validateDescription = (description: string): ValidationResult => {
  if (description && description.length > VALIDATION_RULES.description.maxLength) {
    return { isValid: false, error: ERROR_MESSAGES.DESCRIPTION_TOO_LONG };
  }
  
  return { isValid: true };
};

export const validatePaymentNote = (note: string): ValidationResult => {
  if (note && note.length > VALIDATION_RULES.paymentNote.maxLength) {
    return { isValid: false, error: ERROR_MESSAGES.PAYMENT_NOTE_TOO_LONG };
  }
  
  return { isValid: true };
};

export const validateFormData = (formData: {
  name: string;
  upiId: string;
  price: string;
  description?: string;
  paymentNote?: string;
}): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  const nameValidation = validateItemName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }
  
  const upiValidation = validateUPIId(formData.upiId);
  if (!upiValidation.isValid) {
    errors.upiId = upiValidation.error!;
  }
  
  // Only validate amount if it's provided
  if (formData.price && formData.price.trim() !== '') {
    const amountValidation = validateAmount(formData.price);
    if (!amountValidation.isValid) {
      errors.price = amountValidation.error!;
    }
  }
  
  if (formData.description) {
    const descValidation = validateDescription(formData.description);
    if (!descValidation.isValid) {
      errors.description = descValidation.error!;
    }
  }
  
  if (formData.paymentNote) {
    const noteValidation = validatePaymentNote(formData.paymentNote);
    if (!noteValidation.isValid) {
      errors.paymentNote = noteValidation.error!;
    }
  }
  
  return errors;
};