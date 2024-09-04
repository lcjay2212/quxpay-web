import { create } from 'zustand';

type BalanceProps = {
  balance: {
    balance: number;
    deposit: string;
    withdraw_pending: number;
    total_withdraw: number;
    total_purchase: string;
    is_verified: boolean;
    verification_status: string;
  };
  send_tokens: [];
  purchase_tokens: [];
  redeem_tokens: [];
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
