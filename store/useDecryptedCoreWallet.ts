import { create } from 'zustand';

type WalletsProps = {
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
  decryptedWallets: WalletsProps;
  setDecryptedWallets: (decryptedWallets: WalletsProps) => void;
};
export const useDecryptedCoreWallet = create<Props>((set) => ({
  decryptedWallets: null,
  setDecryptedWallets: (decryptedWallets: WalletsProps): void =>
    set(() => ({
      decryptedWallets,
    })),
}));
