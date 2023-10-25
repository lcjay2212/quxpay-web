export const isBrowser = typeof window !== 'undefined';

export const isLocalHost = (): boolean => {
  // eslint-disable-next-line no-console
  console.log(location.hostname);
  return isBrowser ? location.hostname === 'localhost' || location.hostname === 'https://staging.quxpay.com' : false;
};

export const STAGING_URL = !isLocalHost() ? 'https://api.qux.tv' : 'https://api.quxtech.tv';
