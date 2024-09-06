import { create } from 'zustand';

type Payment = {
  payment?: { bankAccount: { bank_name?: string; nameOnAccount?: string } };
} | null;

type Props = {
  selectedBankDetails?: Payment;
  setSelectedBankDetails: (type: Payment) => void;
};
export const useSelectedBankDetails = create<Props>((set) => ({
  selectedBankDetails: null,
  setSelectedBankDetails: (selectedBankDetails): void =>
    set(() => ({
      selectedBankDetails,
    })),
}));
