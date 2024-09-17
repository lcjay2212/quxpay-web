import { create } from 'zustand';

type BalanceProps = {
  balance: number;
  deposit: string;
  withdraw_pending: number;
  total_withdraw: number;
  total_purchase: string;
  is_verified: boolean;
  verification_status: string;
} | null;

type Props = {
  decryptedBalance: BalanceProps;
  setDecryptedBalance: (decryptedBalance: BalanceProps) => void;
};
export const useDecryptedBalance = create<Props>((set) => ({
  decryptedBalance: null,
  setDecryptedBalance: (decryptedBalance: BalanceProps): void =>
    set(() => ({
      decryptedBalance,
    })),
}));
