export const hasSpecialCharacters = (str: string): boolean => {
  const nonSpecialCharacters = /^[a-zA-Z0-9]+$/;
  return !nonSpecialCharacters.test(str);
};
