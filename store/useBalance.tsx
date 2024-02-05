import { FETCH_WALLET_BALANCE } from 'constants/api';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';

export const useBalance = (): {
  balance: number;
  deposit: number;
  withdrawalPending: number;
  isLoading: boolean;
} => {
  const { data, isLoading } = useQuery('balance', FETCH_WALLET_BALANCE, errorHandler);
  return {
    balance: +data?.balance,
    deposit: +data?.deposit,
    withdrawalPending: +data?.withdraw_pending,
    isLoading,
  };
};
