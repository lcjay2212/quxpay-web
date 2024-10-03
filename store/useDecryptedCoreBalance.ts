import { create } from 'zustand';

type BalanceProps = Details | null;

type Props = {
  coreBalance: BalanceProps;
  setCoreBalance: (coreBalance: BalanceProps) => void;
};
export const useDecryptedCoreBalance = create<Props>((set) => ({
  coreBalance: null,
  setCoreBalance: (coreBalance: BalanceProps): void =>
    set(() => ({
      coreBalance,
    })),
}));
