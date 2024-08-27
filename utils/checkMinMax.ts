export const checkMinMax = (min: number, max: number, str: string): boolean => {
  if (!str) {
    return false;
  }

  if (min >= max) {
    return false;
  }

  return str.length >= min && str.length <= max;
};
