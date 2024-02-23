import { create } from 'zustand';

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  dateFilter: string;
  setDateFilter: (dateFilter: string) => void;
  transactionFilter: string;
  setTransactionFilter: (transactionFilter: string) => void;
  statusFilter: string;
  setStatusFilter: (statusFilter: string) => void;
};
export const useTransactionHistoryFilterModal = create<Props>((set) => ({
  visible: false,
  setVisible: (visible: boolean): void =>
    set(() => ({
      visible,
    })),
  dateFilter: '',
  setDateFilter: (dateFilter: string): void =>
    set(() => ({
      dateFilter,
    })),
  transactionFilter: '',
  setTransactionFilter: (transactionFilter: string): void =>
    set(() => ({
      transactionFilter,
    })),
  statusFilter: '',
  setStatusFilter: (statusFilter: string): void =>
    set(() => ({
      statusFilter,
    })),
}));
