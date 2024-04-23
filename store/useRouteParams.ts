import { create } from 'zustand';

type Props = {
  params: any;
  setParams: (params?: any) => void;
};
export const useRouteParams = create<Props>((set) => ({
  params: '',
  setParams: (params: any): void =>
    set(() => ({
      params,
    })),
}));
