import create from 'zustand';

type Me = {
  token: string;
  firstname: string;
  lastname: string;
  email: string;
  username?: string;
  reg_step2_completed?: boolean;
  reg_step3_completed?: boolean;
} | null;

type Props = {
  user: Me;
  setUser: (e: Me) => void;
};

export const useUser = create<Props>((set) => ({
  user: null,
  setUser: (user: Me): void =>
    set(() => ({
      user,
    })),
}));
