import { create } from 'zustand';

type WalletsProps = Details | null;

type Props = {
  coreWallets: WalletsProps;
  setCoreWallets: (coreWallets: WalletsProps) => void;
};
export const useDecryptedCoreWallet = create<Props>((set) => ({
  coreWallets: null,
  setCoreWallets: (coreWallets: WalletsProps): void =>
    set(() => ({
      coreWallets,
    })),
}));
