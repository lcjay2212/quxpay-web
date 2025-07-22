// Returns true if running in a browser environment
export const isBrowser = typeof window !== 'undefined';

// Returns true if the current host is localhost, staging, or QA
export const isLocalHost = (): boolean => {
  return isBrowser
    ? location.hostname === 'localhost' ||
        location.hostname === 'staging.quxpay.com' ||
        location.hostname === 'qa.quxpay.com'
    : false;
};

// API base URL for staging or production
export const STAGING_URL = !isLocalHost() ? 'https://api.qux.tv' : 'https://p2.api.quxtech.tv';

// API session URL for local development
export const API_SESSION_URL = isBrowser && location.hostname === 'localhost' ? 'http://localhost:3000' : '';
