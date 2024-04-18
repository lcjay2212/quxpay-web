import { create } from 'zustand';

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};
export const usePendingAccountModal = create<Props>((set) => ({
  visible: false,
  setVisible: (visible: boolean): void =>
    set(() => ({
      visible,
    })),
}));
