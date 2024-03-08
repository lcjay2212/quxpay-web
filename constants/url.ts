export const isBrowser = typeof window !== 'undefined';

export const isLocalHost = (): boolean => {
  return isBrowser ? location.hostname === 'localhost' || location.hostname === 'staging.quxpay.com' : false;
};

export const STAGING_URL = !isLocalHost() ? 'https://api.qux.tv' : 'https://p2.api.quxtech.tv';

export const API_SESSION_URL = isBrowser && location.hostname === 'localhost' ? 'http://localhost:3000' : '';
