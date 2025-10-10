import { create } from 'zustand';

interface DeleteBankModalStore {
  visible: boolean;
  bankId: string | null;
  setVisible: (visible: boolean) => void;
  openModal: (bankId: string) => void;
}

export const useDeleteBankModal = create<DeleteBankModalStore>((set) => ({
  visible: false,
  bankId: null,
  setVisible: (visible: boolean): void => set({ visible }),
  openModal: (bankId: string): void => set({ visible: true, bankId }),
}));
