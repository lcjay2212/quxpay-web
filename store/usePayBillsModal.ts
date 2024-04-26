import { create } from 'zustand';

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  headerName: string;
  setHeaderName: (headerName: string) => void;
  billerData: {
    corporate_name?: string;
    id?: number;
    image?: null;
    name?: string;
    biller_category_id?: number;
  };
  setBillerData: (billerData: { corporate_name: string; id: number; image: null; name: string }) => void;
};
export const usePayBillsModal = create<Props>((set) => ({
  visible: false,
  setVisible: (visible: boolean): void =>
    set(() => ({
      visible,
    })),
  headerName: '',
  setHeaderName: (headerName: string): void =>
    set(() => ({
      headerName,
    })),
  billerData: {},
  setBillerData: (billerData): void =>
    set(() => ({
      billerData,
    })),
}));
