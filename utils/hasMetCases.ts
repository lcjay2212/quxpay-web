import { hasOneLowerCase, hasOneNumber, hasOneUpperCase } from './hasLettersNumbers';
import { hasSpecialCharacters } from './hasSpecialCharacters';

export const hasMetCases = (str: string, caseNumber: number): boolean => {
  let total = 0;

  if (hasOneLowerCase(str)) {
    total += 1;
  }

  if (hasOneUpperCase(str)) {
    total += 1;
  }

  if (hasOneNumber(str)) {
    total += 1;
  }

  if (hasSpecialCharacters(str)) {
    total += 1;
  }

  return total >= caseNumber;
};
