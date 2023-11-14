export const isBrowser = typeof window !== 'undefined';

export const isLocalHost = (): boolean => {
  return isBrowser ? location.hostname === 'localhost' || location.hostname === 'staging.quxpay.com' : false;
};

export const STAGING_URL = !isLocalHost() ? 'https://api.qux.tv' : 'https://api.quxtech.tv';

export const API_SESSION_URL = isLocalHost()
  ? location.hostname === 'localhost'
    ? 'http://localhost:3000/'
    : 'staging.quxpay.com'
  : 'quxpay.com';
