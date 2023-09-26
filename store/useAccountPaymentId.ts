import { create } from 'zustand';

type Props = {
  paymentId: string;
  setPaymentId: (payment: string) => void;
};
export const useAccountPaymentId = create<Props>((set) => ({
  paymentId: '',
  setPaymentId: (paymentId: string): void =>
    set(() => ({
      paymentId,
    })),
}));
