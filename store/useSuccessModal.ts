import { create } from 'zustand';

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  message: string;
  setMessage: (message: string) => void;
};
export const useSuccessModal = create<Props>((set) => ({
  visible: false,
  setVisible: (visible: boolean): void =>
    set(() => ({
      visible,
    })),
  message: '',
  setMessage: (message: string): void =>
    set(() => ({
      message,
    })),
}));
