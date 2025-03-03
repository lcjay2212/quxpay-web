import { create } from 'zustand';

type Props = {
  computationData?: {
    amount: number;
    qux_charge: number;
    total_amount: number;
  } | null;
  setComputationData: (computationData?: { amount: number; qux_charge: number; total_amount: number }) => void;
};
export const useComputationData = create<Props>((set) => ({
  computationData: null,
  setComputationData: (computationData): void =>
    set(() => ({
      computationData,
    })),
}));
