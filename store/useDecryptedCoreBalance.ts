import { create } from 'zustand';

type BalanceProps = {
  details: {
    master_public_key: string;
    core: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changes: any;
    signature: string;
  };
  masterPublicKey: string;
  encryptedMainKey: string;
  decryptedMainKey: string;
  iv: string;
  key: string;
  userPublicKeyPem: string;
} | null;

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
