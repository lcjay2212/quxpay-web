import create from 'zustand';

type Me = {
  token: string;
  roles: string[];
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  profile_id: string;
  profile_picture: any;
  has_store: boolean;
  stream_auth_key: string;
  merchant: boolean;
  advertiser: boolean;
  content_creator: boolean;
  purchaser: boolean;
  corporate: boolean;
  advertiser_has_company: boolean;
  reg_step2_completed: any;
  reg_step3_completed: any;
  incomplete_registration: any;
  purchaser_info: any;
  privatekey: string;
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
