import { create } from 'zustand';

type Props = {
  selectedCrypto?: {
    address?: string;
    currency?: string;
    id?: number;
    name?: string;
  } | null;
  setSelectedCrypto: (selectedCrypto: { address?: string; currency?: string; id?: number; name?: string }) => void;
};
export const useSelectedCrypto = create<Props>((set) => ({
  selectedCrypto: null,
  setSelectedCrypto: (selectedCrypto): void =>
    set(() => ({
      selectedCrypto,
    })),
}));
