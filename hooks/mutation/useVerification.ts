import { useMutation } from '@tanstack/react-query';
import storage from 'constants/storage';
import { API_SESSION_URL } from 'constants/url';
import { useRouter } from 'next/router';
import { usePendingAccountModal, useRouteParams, useUser, useVerifyOtp } from 'store';
import { notify } from 'utils';
import api from 'utils/api';

type SelectedRole = 'regular' | 'corporate' | string | undefined;

interface VerifyRequest {
  email: string;
  otp: string;
  type?: string;
}

interface ResendRequest {
  email: string;
  type?: string;
}

interface ApiUserData {
  token: string;
  email: string;
  corporate_approved?: boolean;
  [key: string]: unknown;
}

interface VerifyResponse {
  data: ApiUserData;
}

const storeUserSession = (userData: ApiUserData, setUser: (u: unknown) => void): void => {
  sessionStorage.setItem(storage.QUX_PAY_USER_DETAILS, JSON.stringify(userData));
  sessionStorage.setItem(storage.QUX_PAY_USER_TOKEN, userData.token);
  setUser(userData);
};

const createLoginSession = async (token: string): Promise<boolean> => {
  try {
    const loginSession = await fetch(`${API_SESSION_URL}/api/login?token=${token}`);
    const json = await loginSession.json();
    return Boolean(json?.success);
  } catch {
    return false;
  }
};

export const useVerification = ({
  selected,
}: {
  selected?: SelectedRole;
}): {
  verify: (payload: VerifyRequest) => Promise<unknown>;
  resend: (payload: ResendRequest) => Promise<unknown>;
  isVerifying: boolean;
  isResending: boolean;
} => {
  const router = useRouter();
  const setVisible = usePendingAccountModal((e) => e.setVisible);
  const setUser = useUser((e) => e.setUser);
  const { setVerify, setEmail } = useVerifyOtp();
  const params = useRouteParams((e) => e.params);

  const { mutateAsync: verify, isPending: isVerifying } = useMutation({
    mutationFn: (variable: VerifyRequest) => api.post<VerifyResponse>('web/otp/verify', variable),
    onSuccess: async ({ data }) => {
      const userData = data.data;

      const sessionCreated = await createLoginSession(userData.token);
      if (!sessionCreated) {
        notify('Login failed. Please try again.', { status: 'error' });
      } else {
        setEmail(userData.email);
      }

      notify('Verify OTP success');
      setVerify(false);
      setEmail(null);

      storeUserSession(userData, setUser);

      const isRegular = selected === undefined || selected === 'regular';
      if (isRegular) {
        if (!userData.corporate_approved) {
          const redirectUrl = params?.t ? '/checkout' : '/dashboard';
          void router.push(redirectUrl);
        } else {
          setVisible(true);
        }
      } else {
        setVisible(true);
      }
    },
    onError: ({ response }: { response?: { data?: { status?: { message?: string }; errors?: { otp?: string } } } }) => {
      const message = response?.data?.status?.message || response?.data?.errors?.otp || 'Verification failed';
      notify(message, { status: 'error' });
    },
  });

  const { mutateAsync: resend, isPending: isResending } = useMutation({
    mutationFn: (variable: ResendRequest) => api.post('web/otp/resend', variable),
    onSuccess: () => {
      notify('Resend login OTP success');
    },
    onError: ({ response }: { response?: { data?: { status?: { message?: string } } } }) => {
      const message = response?.data?.status?.message || 'Resend failed';
      notify(message, { status: 'error' });
    },
  });

  return { verify, resend, isVerifying, isResending };
};
