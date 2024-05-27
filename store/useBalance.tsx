import { FETCH_WALLET_BALANCE } from 'constants/api';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';

export const useBalance = (): {
  balance: number;
  deposit: number;
  withdrawalPending: number;
  totalPurchase: number;
  totalWithdraw: number;
  isVerified: boolean;
  isLoading: boolean;
  verificationStatus: string;
} => {
  const { data, isLoading } = useQuery('balance', FETCH_WALLET_BALANCE, errorHandler);
  return {
    balance: +data?.balance,
    deposit: +data?.deposit,
    withdrawalPending: +data?.withdraw_pending,
    totalPurchase: +data?.total_purchase,
    totalWithdraw: +data?.total_withdraw,
    isVerified: data?.is_verified,
    verificationStatus: data?.verification_status,
    isLoading,
  };
};
