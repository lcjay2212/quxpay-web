import axios from 'axios';
import { QueryFunctionContext } from 'react-query';
import { STAGING_URL } from './url';

export const post = async <T>(url: string, variable: void): Promise<T> =>
  await axios.post(`${STAGING_URL}/${url}`, variable);

const token = typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN;

const getData = async <T>(apiUrl: string, url: string, customToken?: string): Promise<T> => {
  const { data } = await axios.get(`${apiUrl}/${url}`, {
    headers: {
      Authorization: `Bearer ${customToken ?? token}`,
    },
  });
  return data.data;
};

export const FETCH_WALLET_BALANCE = async (): Promise<any> => {
  return await getData<any>(STAGING_URL, `web/wallet/balance`, localStorage.QUX_PAY_USER_TOKEN);
};
export const FETCH_TRANSACTION_HISTORY = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/wallet/transactions`, localStorage.QUX_PAY_USER_TOKEN);
export const FETCH_NOTIFICATION_HISTORY = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/notifications`, localStorage.QUX_PAY_USER_TOKEN);
export const FETCH_BANK_AND_CREDIT_CARD = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/bankaccount/list`, localStorage.QUX_PAY_USER_TOKEN);
export const FETCH_FRIEND_LIST = async (): Promise<any> =>
  await getData<any>(STAGING_URL, `web/friends`, localStorage.QUX_PAY_USER_TOKEN);
export const FETCH_BANK_LIST = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await getData<any>(STAGING_URL, `web/banks/list?search=${queryKey[1]}`, localStorage.QUX_PAY_USER_TOKEN);
export const SHOW_BANK_ACCOUNT_DETAILS = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await getData<any>(STAGING_URL, `web/bankaccount/show/${queryKey[1]}`, localStorage.QUX_PAY_USER_TOKEN);

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
