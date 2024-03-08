import { create } from 'zustand';

type Props = {
  privatekey: string;
  setPrivatekey: (privatekey: string) => void;
};
export const usePrivatekey = create<Props>((set) => ({
  privatekey: '',
  setPrivatekey: (privatekey: string): void =>
    set(() => ({
      privatekey,
    })),
}));
