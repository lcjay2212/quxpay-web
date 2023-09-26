/* eslint-disable @typescript-eslint/explicit-function-return-type */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const blockInvalidChar = (e: { key: string; preventDefault: () => void }) =>
  ['+', '-', '.', 'e', 'E'].includes(e.key) && e.preventDefault();
