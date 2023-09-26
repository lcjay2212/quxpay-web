import axios from 'axios';
import { QueryFunctionContext } from 'react-query';
import { STAGING_URL } from './url';

export const post = async <T>(url: string, variable: void): Promise<T> =>
  await axios.post(`${STAGING_URL}/${url}`, variable);

const token = typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN;

export const options = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const getData = async <T>(url: string): Promise<T> => {
  const { data } = await axios.get(`${STAGING_URL}/${url}`, options);
  return data.data;
};

export const FETCH_WALLET_BALANCE = async (): Promise<any> => await getData<any>(`web/wallet/balance`);
export const FETCH_TRANSACTION_HISTORY = async (): Promise<any> => await getData<any>(`web/wallet/transactions`);
export const FETCH_BANK_AND_CREDIT_CARD = async (): Promise<any> => await getData<any>(`web/bankaccount/list`);
export const FETCH_FRIEND_LIST = async (): Promise<any> => await getData<any>(`web/friends`);
export const FETCH_BANK_LIST = async (): Promise<any> => await getData<any>(`web/banks/list`);

export const SHOW_BANK_ACCOUNT_DETAILS = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await getData<any>(`web/bankaccount/show/${queryKey[1]}`);
