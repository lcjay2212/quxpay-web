import { QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';
import { clearStorage, notify } from 'utils';

export const post = async <T>(url: string, variable: void): Promise<T> =>
  await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${url}`, variable, {
    headers: {
      Version: 2,
    },
  });

const getData = async <T>(apiUrl: string, url: string): Promise<T | undefined> => {
  const token = sessionStorage.QUX_PAY_USER_TOKEN;

  try {
    const { data } = await axios.get(`${apiUrl}/${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Version: 2,
      },
    });
    return data.data;
  } catch (error) {
    if (error.response.status === 401) {
      clearStorage();
      window.location.href = '/';
      notify(error.message, { status: 'error' });
    }
  }
};

// Generalized fetch function
const fetchResource = async (endpoint: string): Promise<any> => {
  return await getData<any>(`${process.env.NEXT_PUBLIC_API_BASE_URL}`, endpoint);
};

export const FETCH_WALLET_BALANCE = async (): Promise<any> => await fetchResource('web/wallet/balance');

export const FETCH_TRANSACTION_HISTORY = async (): Promise<any> => await fetchResource(`web/wallet/transactions`);

export const FETCH_CRYPTO_TRANSACTION_HISTORY = async (): Promise<any> =>
  await fetchResource(`web/crypto/transactions`);

export const FETCH_NOTIFICATION_HISTORY = async (): Promise<any> => await fetchResource(`web/notifications`);

export const FETCH_BANK_AND_CREDIT_CARD = async (): Promise<any> => await fetchResource(`web/bankaccount/list`);

export const FETCH_FRIEND_LIST = async (): Promise<any> => await fetchResource(`web/friends`);
export const FETCH_BANK_LIST = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await fetchResource(`web/banks/list?search=${queryKey[1]}${!queryKey[2] ? '' : `&routing_number=${queryKey[2]}`}`);

export const SHOW_BANK_ACCOUNT_DETAILS = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await fetchResource(`web/wallet/show?payment_profile_id=${queryKey[1]}&payment_type=${queryKey[2]}`);

export const FETCH_POS_HISTORY = async (): Promise<any> => await fetchResource(`web/pos`);

export const FETCH_POS_HISTORY_BY_ID = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await fetchResource(`web/pos/${queryKey[1]}/show`);

export const FETCH_PRODUCT_LIST = async (): Promise<any> => await fetchResource(`web/pos/product/list`);

export const FETCH_RECENT_PRODUCT_LIST = async (): Promise<any> => await fetchResource(`web/pos/product/recent`);

export const FETCH_TRANSACTION_HISTORY_PHASE_TWO = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await fetchResource(
    `web/wallet/transactions?${!queryKey[1] ? '' : `date=${queryKey[1]}&`}${
      !queryKey[2] ? '' : `status=${queryKey[2]}&`
    }${!queryKey[3] ? '' : `transaction_type=${queryKey[3]}`}`
  );

export const FETCH_INSIGHTS = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await fetchResource(
    `web/insight?${!queryKey[1] ? '' : `filter_type=${queryKey[1]}&`}${
      !queryKey[2] ? '' : `filter_date=${queryKey[2]}`
    }`
  );

export const FETCH_BILLING_CATEGORIES = async (): Promise<any> => await fetchResource(`web/billing/categories`);

export const FETCH_BILLER_BY_CATEGORY_ID = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await fetchResource(`web/billing/billers-by-category?biller_type_id=${queryKey[1]}`);

export const FETCH_BILLER = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await fetchResource(`web/billing/search/billers?search=${queryKey[1]}`);

export const FETCH_SCHEDULED_PAYMENT_INFO_BY_ID = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await fetchResource(`web/billing/saved-info?saved_payment_info_id=${queryKey[1]}`);

export const FETCH_SCHEDULED_PAYMENT_LISTS = async (): Promise<any> =>
  await fetchResource(`web/billing/scheduled-payments`);

export const FETCH_WP_PO_DETAILS = async ({ queryKey }: QueryFunctionContext): Promise<any> =>
  await fetchResource(`web/wp/po-details?wp=${queryKey[1]}`);

export const FETCH_AUTHENTICATION = async (): Promise<any> => await fetchResource(`web/authentication`);

export const FETCH_BANK_CREDIT_CARD_CRYPTO = async (): Promise<any> =>
  await fetchResource(`web/wallet/bank-and-credit`);

export const FETCH_CRYPTO_CURRENCY_LIST = async (): Promise<any> => await fetchResource(`web/crypto/currency`);

export const FETCH_CAPTCHA = async (): Promise<any> => await fetchResource(`web/captcha`);

export const FETCH_SECURITY_MAIN_FILE = async (): Promise<any> => await fetchResource(`web/encryption/main-file`);

export const FETCH_BANK_STATUS = async (): Promise<any> => await fetchResource(`web/verify/bank-status`);

export const FETCH_STATES = async (): Promise<any> => await fetchResource(`web/states`);
