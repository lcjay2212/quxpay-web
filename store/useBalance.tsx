import { useQuery } from '@tanstack/react-query';
import { FETCH_WALLET_BALANCE } from 'constants/api';

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
  const { data, isLoading } = useQuery({
    queryKey: ['balance'],
    queryFn: FETCH_WALLET_BALANCE,
  });
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
