import { QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';
import { STAGING_URL } from './url';

export const post = async <T>(url: string, variable: void): Promise<T> =>
  await axios.post(`${STAGING_URL}/${url}`, variable, {
    headers: {
      Version: 2,
    },
  });

const token = typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN;

const getData = async <T>(apiUrl: string, url: string, customToken?: string): Promise<T> => {
  const { data } = await axios.get(`${apiUrl}/${url}`, {
    headers: {
      Authorization: `Bearer ${customToken ?? token}`,
      Version: 2,
    },
  });
  return data.data;
};

export const FETCH_WALLET_BALANCE = async (): Promise<any> => {
  return await getData<any>(STAGING_URL, `web/wallet/balance`, localStorage.QUX_PAY_USER_TOKEN);
};
export const FETCH_TRANSACTION_HISTORY = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/wallet/transactions`, localStorage.QUX_PAY_USER_TOKEN);
export const FETCH_CRYPTO_TRANSACTION_HISTORY = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/crypto/transactions`, localStorage.QUX_PAY_USER_TOKEN);
export const FETCH_NOTIFICATION_HISTORY = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/notifications`, localStorage.QUX_PAY_USER_TOKEN);
export const FETCH_BANK_AND_CREDIT_CARD = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/bankaccount/list`, localStorage.QUX_PAY_USER_TOKEN);
export const FETCH_FRIEND_LIST = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/friends`, localStorage.QUX_PAY_USER_TOKEN);
export const FETCH_BANK_LIST = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await getData<any>(
    STAGING_URL,
    `web/banks/list?search=${queryKey[1]}${!queryKey[2] ? '' : `&routing_number=${queryKey[2]}`}`,
    localStorage.QUX_PAY_USER_TOKEN
  );
export const SHOW_BANK_ACCOUNT_DETAILS = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await getData<any>(
    STAGING_URL,
    `web/wallet/show?payment_profile_id=${queryKey[1]}&payment_type=${queryKey[2]}`,
    localStorage.QUX_PAY_USER_TOKEN
  );

export const FETCH_POS_HISTORY = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/pos`, localStorage.QUX_PAY_USER_TOKEN);

export const FETCH_POS_HISTORY_BY_ID = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await getData<any>(STAGING_URL, `web/pos/${queryKey[1]}/show`, localStorage.QUX_PAY_USER_TOKEN);

export const FETCH_PRODUCT_LIST = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/pos/product/list`, localStorage.QUX_PAY_USER_TOKEN);

export const FETCH_RECENT_PRODUCT_LIST = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/pos/product/recent`, localStorage.QUX_PAY_USER_TOKEN);

export const FETCH_TRANSACTION_HISTORY_PHASE_TWO = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await getData<any>(
    STAGING_URL,
    `web/wallet/transactions?${!queryKey[1] ? '' : `date=${queryKey[1]}&`}${
      !queryKey[2] ? '' : `status=${queryKey[2]}&`
    }${!queryKey[3] ? '' : `transaction_type=${queryKey[3]}`}`,
    localStorage.QUX_PAY_USER_TOKEN
  );

export const FETCH_INSIGHTS = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await getData<any>(
    STAGING_URL,
    `web/insight?${!queryKey[1] ? '' : `filter_type=${queryKey[1]}&`}${
      !queryKey[2] ? '' : `filter_date=${queryKey[2]}`
    }`,
    localStorage.QUX_PAY_USER_TOKEN
  );

export const FETCH_BILLING_CATEGORIES = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/billing/categories`, localStorage.QUX_PAY_USER_TOKEN);

export const FETCH_BILLER_BY_CATEGORY_ID = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await getData<any>(
    STAGING_URL,
    `web/billing/billers-by-category?biller_type_id=${queryKey[1]}`,
    localStorage.QUX_PAY_USER_TOKEN
  );

export const FETCH_BILLER = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await getData<any>(STAGING_URL, `web/billing/search/billers?search=${queryKey[1]}`, localStorage.QUX_PAY_USER_TOKEN);

export const FETCH_SCHEDULED_PAYMENT_INFO_BY_ID = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await getData<any>(
    STAGING_URL,
    `web/billing/saved-info?saved_payment_info_id=${queryKey[1]}`,
    localStorage.QUX_PAY_USER_TOKEN
  );

export const FETCH_SCHEDULED_PAYMENT_LISTS = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/billing/scheduled-payments`, localStorage.QUX_PAY_USER_TOKEN);

export const FETCH_WP_PO_DETAILS = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await getData<any>(STAGING_URL, `web/wp/po-details?wp=${queryKey[1]}`, localStorage.QUX_PAY_USER_TOKEN);

export const FETCH_AUTHENTICATION = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/authentication`, localStorage.QUX_PAY_USER_TOKEN);

export const FETCH_BANK_CREDIT_CARD_CRYPTO = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/wallet/bank-and-credit`, localStorage.QUX_PAY_USER_TOKEN);

export const FETCH_CRYPTO_CURRENCY_LIST = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/crypto/currency`, localStorage.QUX_PAY_USER_TOKEN);

export const FETCH_CAPTCHA = async (): Promise<any> => await getData<any>(STAGING_URL, `web/captcha`);
export const FETCH_SECURITY_MAIN_FILE = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/encryption/main-file`);
