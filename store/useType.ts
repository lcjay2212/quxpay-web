import { create } from 'zustand';

type Props = {
  type?: string;
  setType: (type: 'BANK' | 'CREDIT' | 'EXISTING_CREDITCARD' | 'CRYPTO' | 'ADD_CRYPTO' | 'ADD_BANK') => void;
};
export const useType = create<Props>((set) => ({
  type: undefined,
  setType: (type): void =>
    set(() => ({
      type,
    })),
}));
