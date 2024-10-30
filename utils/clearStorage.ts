import storage from 'constants/storage';

export const clearStorage = (): void => {
  const items = [storage.QUX_PAY_USER_TOKEN, storage.QUX_PAY_USER_DETAILS, storage.QUX_QUERY_OFFLINE_CACHE];
  items.forEach((item) => sessionStorage.removeItem(item));
};
