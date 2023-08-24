export const isBrowser = typeof window !== 'undefined';

export const isLocalHost = (): boolean => {
  return isBrowser ? location.hostname === 'localhost' || location.hostname === 'admin.quxtech.tv' : false;
};

export const STAGING_URL = !isLocalHost() ? 'https://api.qux.tv/v' : 'https://api.quxtech.tv/v';
