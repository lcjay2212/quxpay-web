import { create } from 'zustand';

type Props = {
  paymentData?: {
    paymentId?: string;
    paymentType?: string;
  } | null;
  setPaymentData: (paymentData: { paymentId?: string; paymentType?: string }) => void;
};
export const useAccountPaymentId = create<Props>((set) => ({
  paymentData: null,
  setPaymentData: (paymentData): void =>
    set(() => ({
      paymentData,
    })),
}));
