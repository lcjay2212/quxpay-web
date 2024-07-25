import { create } from 'zustand';

type Props = {
  selectedBankDetails?: {
    payment: { bankAccount: { bank_name?: string; nameOnAccount?: string } };
  } | null;
  setSelectedBankDetails: (type: { payment: { bankAccount: { bank_name?: string; nameOnAccount?: string } } }) => void;
};
export const useSelectedBankDetails = create<Props>((set) => ({
  selectedBankDetails: null,
  setSelectedBankDetails: (selectedBankDetails): void =>
    set(() => ({
      selectedBankDetails,
    })),
}));
