import { create } from 'zustand';

type Props = {
  type?: 'BANK' | 'CREDIT' | 'EXISTING_CREDITCARD' | 'CRYPTO' | 'ADD_CRYPTO' | 'ADD_BANK' | null;
  setType: (type: 'BANK' | 'CREDIT' | 'EXISTING_CREDITCARD' | 'CRYPTO' | 'ADD_CRYPTO' | 'ADD_BANK' | null) => void;
};

export const useType = create<Props>((set) => ({
  type: null,
  setType: (type): void =>
    set(() => ({
      type,
    })),
}));
