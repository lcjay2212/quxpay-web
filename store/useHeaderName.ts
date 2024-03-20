import { create } from 'zustand';

type Props = {
  name: string;
  setName: (name: string) => void;
};
export const useHeaderName = create<Props>((set) => ({
  name: '',
  setName: (name: string): void =>
    set(() => ({
      name,
    })),
}));
