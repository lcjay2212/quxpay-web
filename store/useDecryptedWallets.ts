import { create } from 'zustand';

type WalletsProps = {
  credit_card: {
    customerPaymentProfileId?: string;
    defaultPaymentProfile?: null;
    payment_type?: string;
    payment: {
      creditCard: {
        cardNumber: string;
        expirationDate: string;
        cardType: string;
      };
    };
  };
  bank: [
    {
      customerPaymentProfileId: string;
      defaultPaymentProfile: string;
      payment_type: string;
      payment: {
        bankAccount: {
          accountType: string;
          accountNumber: string;
          routingNumber: string;
          nameOnAccount: string;
          echeckType: string;
          bank_name: string;
        };
      };
    }
  ];
  crypto: [
    {
      address: string;
      name: string;
      currency: string;
      id: number;
    }
  ];
} | null;

type Props = {
  decryptedWallets: WalletsProps;
  setDecryptedWallets: (decryptedWallets: WalletsProps) => void;
};
export const useDecryptedWallets = create<Props>((set) => ({
  decryptedWallets: null,
  setDecryptedWallets: (decryptedWallets: WalletsProps): void =>
    set(() => ({
      decryptedWallets,
    })),
}));
