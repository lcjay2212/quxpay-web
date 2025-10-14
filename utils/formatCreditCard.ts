export const formatCardNumber = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '');

  const limitedDigits = digitsOnly.slice(0, 19);

  return limitedDigits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, '');

  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const getCardType = (cardNumber: string): string => {
  const digits = cardNumber.replace(/\D/g, '');

  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^6(?:011|5)/.test(digits)) return 'discover';
  if (/^3[0689]/.test(digits)) return 'diners';
  if (/^(?:2131|1800|35\d{3})/.test(digits)) return 'jcb';

  return 'unknown';
};

export const formatExpiryDate = (value: string): string => {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, '');

  // Limit to 4 digits (MMYY)
  const limitedDigits = digitsOnly.slice(0, 4);

  // Add slash after month if we have at least 2 digits
  if (limitedDigits.length >= 2) {
    return `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2)}`;
  }

  return limitedDigits;
};

export const validateExpiryDate = (expiryDate: string): boolean => {
  const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!regex.test(expiryDate)) {
    return false;
  }

  const [month, year] = expiryDate.split('/');
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10) + 2000; // Convert YY to YYYY

  if (monthNum < 1 || monthNum > 12) {
    return false;
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return false;
  }

  return true;
};

export const blockInvalidCardChars = (e: KeyboardEvent | React.KeyboardEvent): void => {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ];

  if (allowedKeys.includes(e.key)) {
    return;
  }

  if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
    return;
  }

  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};

export const blockInvalidExpiryChars = (e: KeyboardEvent | React.KeyboardEvent): void => {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ];

  if (allowedKeys.includes(e.key)) {
    return;
  }

  if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
    return;
  }

  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};
