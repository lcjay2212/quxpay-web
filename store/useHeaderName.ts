import { create } from 'zustand';

type Props = {
  headerName: string;
  setHeaderName: (headerName: string) => void;
};
export const useHeaderName = create<Props>((set) => ({
  headerName: '',
  setHeaderName: (headerName: string): void =>
    set(() => ({
      headerName,
    })),
}));
