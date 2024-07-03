import { create } from 'zustand';

type CryptoPayment = {
  address?: string;
  amount?: number;
  amount_exchange?: string;
  currency?: string;
  fast_transaction_fee?: string;
  network_processing_fee?: string;
  payment_id?: string;
  pos_id?: string;
  qr_img?: string;
  qux_charge?: number;
  rate?: string;
  total_amount?: number;
} | null;

type Props = {
  cryptoPaymentData: CryptoPayment;
  setCryptoPaymentData: (cryptoPaymentData: CryptoPayment) => void;
};
export const useCryptoPaymentData = create<Props>((set) => ({
  cryptoPaymentData: null,
  setCryptoPaymentData: (cryptoPaymentData: CryptoPayment): void =>
    set(() => ({
      cryptoPaymentData,
    })),
}));
