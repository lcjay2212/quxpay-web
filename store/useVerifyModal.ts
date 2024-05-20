import { create } from 'zustand';

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};
export const useVerifyModal = create<Props>((set) => ({
  visible: false,
  setVisible: (visible: boolean): void =>
    set(() => ({
      visible,
    })),
}));
