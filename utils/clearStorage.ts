import storage from 'constants/storage';

export const clearStorage = (): void => {
  const items = [storage.QUX_PAY_USER_TOKEN, storage.QUX_PAY_USER_DETAILS];
  items.forEach((item) => sessionStorage.removeItem(item));
};
