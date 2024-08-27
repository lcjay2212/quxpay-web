export const hasOneLowerCase = (str: string): boolean => /[a-z]/.test(str);
export const hasOneUpperCase = (str: string): boolean => /[A-Z]/.test(str);
export const hasOneNumber = (str: string): boolean => /\d/.test(str);

export const hasLettersNumbers = (str: string, combination?: boolean): boolean => {
  return hasOneLowerCase(str) && hasOneNumber(str) && (combination ? hasOneUpperCase(str) : !hasOneUpperCase(str));
};
