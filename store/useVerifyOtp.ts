import { create } from 'zustand';

type Props = {
  verify: boolean;
  setVerify: (verify: boolean) => void;
  email: string | null;
  setEmail: (email: string | null) => void;
  type: string;
  setType: (type: string) => void;
};
export const useVerifyOtp = create<Props>((set) => ({
  verify: false,
  setVerify: (verify: boolean): void =>
    set(() => ({
      verify,
    })),
  email: null,
  setEmail: (email): void =>
    set(() => ({
      email,
    })),
  type: 'login',
  setType: (type): void =>
    set(() => ({
      type,
    })),
}));
