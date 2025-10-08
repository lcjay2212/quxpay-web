import { create } from 'zustand';

type Props = {
  visible: boolean;
  cardId: string | null;
  setVisible: (visible: boolean) => void;
  setCardId: (cardId: string | null) => void;
  openModal: (cardId: string) => void;
  closeModal: () => void;
};

export const useDeleteCreditCardModal = create<Props>((set) => ({
  visible: false,
  cardId: null,
  setVisible: (visible: boolean): void =>
    set(() => ({
      visible,
    })),
  setCardId: (cardId: string | null): void =>
    set(() => ({
      cardId,
    })),
  openModal: (cardId: string): void =>
    set(() => ({
      visible: true,
      cardId,
    })),
  closeModal: (): void =>
    set(() => ({
      visible: false,
      cardId: null,
    })),
}));
