import { create } from 'zustand';

type Props = {
  page: number;
  setPage: (page: number) => void;
};

export const usePage = create<Props>((set) => ({
  page: 0,
  setPage: (page): void =>
    set(() => ({
      page,
    })),
}));
