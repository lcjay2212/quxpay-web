import axios from 'axios';
import { QueryFunctionContext } from 'react-query';
import { STAGING_URL } from './url';

export const post = async <T>(url: string, variable: void): Promise<T> =>
  await axios.post(`${STAGING_URL}/${url}`, variable);

const token = typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN;

const getData = async <T>(url: string, customToken?: string): Promise<T> => {
  const { data } = await axios.get(`${STAGING_URL}/${url}`, {
    headers: {
      Authorization: `Bearer ${customToken ?? token}`,
    },
  });
  return data.data;
};

export const FETCH_WALLET_BALANCE = async (): Promise<any> => {
  return await getData<any>(`web/wallet/balance`, localStorage.QUX_PAY_USER_TOKEN);
};
export const FETCH_TRANSACTION_HISTORY = async (): Promise<any> =>
  await getData<any>(`web/wallet/transactions`, localStorage.QUX_PAY_USER_TOKEN);
export const FETCH_BANK_AND_CREDIT_CARD = async (): Promise<any> =>
  await getData<any>(`web/bankaccount/list`, localStorage.QUX_PAY_USER_TOKEN);
export const FETCH_FRIEND_LIST = async (): Promise<any> =>
  await getData<any>(`web/friends`, localStorage.QUX_PAY_USER_TOKEN);
export const FETCH_BANK_LIST = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await getData<any>(`web/banks/list?search=${queryKey[1]}`, localStorage.QUX_PAY_USER_TOKEN);
export const SHOW_BANK_ACCOUNT_DETAILS = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await getData<any>(`web/bankaccount/show/${queryKey[1]}`, localStorage.QUX_PAY_USER_TOKEN);

export const FETCH_POS_HISTORY = async (): Promise<any> =>
  await getData<any>(`web/pos`, localStorage.QUX_PAY_USER_TOKEN);

export const FETCH_POS_HISTORY_BY_ID = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await getData<any>(`web/pos/${queryKey[1]}/show`, localStorage.QUX_PAY_USER_TOKEN);