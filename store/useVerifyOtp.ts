import { create } from 'zustand';

type Props = {
  verify: boolean;
  setVerify: (verify: boolean) => void;
};
export const useVerifyOtp = create<Props>((set) => ({
  verify: false,
  setVerify: (verify: boolean): void =>
    set(() => ({
      verify,
    })),
}));
