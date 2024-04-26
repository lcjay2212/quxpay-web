import { create } from 'zustand';

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  headerName: string;
  setHeaderName: (headerName: string) => void;
  billerId: string;
  setBillerId: (billerId: string) => void;
  billerData?: {
    id?: number;
    biller?: string;
    account_number?: string;
    account_name?: string;
    nickname?: string;
    amount?: string;
    frequency?: string;
    payment_date?: string;
  };
  setBillerData: (billerData?: {
    id?: number;
    biller?: string;
    account_number?: string;
    account_name?: string;
    nickname?: string;
    amount?: string;
    frequency?: string;
    payment_date?: string;
  }) => void;
};
export const useSchedulePayBillModal = create<Props>((set) => ({
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
  billerId: '',
  setBillerId: (billerId: string): void =>
    set(() => ({
      billerId,
    })),
  billerData: {},
  setBillerData: (billerData): void =>
    set(() => ({
      billerData,
    })),
}));
