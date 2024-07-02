import { create } from 'zustand';

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  type?: string | null;
  setType: (type?: string) => void;
  amount?: number;
  setAmount: (amount: number) => void;
};
export const useCongratulationContent = create<Props>((set) => ({
  visible: true,
  setVisible: (visible: boolean): void =>
    set(() => ({
      visible,
    })),
  type: null,
  setType: (type?: string): void =>
    set(() => ({
      type,
    })),
  amount: 0,
  setAmount: (amount: number): void =>
    set(() => ({
      amount,
    })),
}));
