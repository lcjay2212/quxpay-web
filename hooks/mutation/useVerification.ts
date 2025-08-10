import { useMutation } from '@tanstack/react-query';
import storage from 'constants/storage';
import { API_SESSION_URL } from 'constants/url';
import { useRouter } from 'next/router';
import { usePendingAccountModal, useRouteParams, useUser, useVerifyOtp } from 'store';
import { notify } from 'utils';
import api from 'utils/api';

export const useVerification = ({
  selected,
}: {
  selected?: string;
}): { verify: any; resend: any; isVerifying: boolean; isResending: boolean } => {
  const router = useRouter();
  const setVisible = usePendingAccountModal((e) => e.setVisible);
  const setUser = useUser((e) => e.setUser);
  const { setVerify, setEmail } = useVerifyOtp();
  const params = useRouteParams((e) => e.params);

  const { mutateAsync: verify, isPending: isVerifying } = useMutation({
    mutationFn: (variable) => api.post('web/otp/verify', variable),
    onSuccess: async ({ data }: any) => {
      try {
        const loginSession = await fetch(`${API_SESSION_URL}/api/login?token=${data.data.token}`);
        const json = await loginSession.json();
        if (json.success) {
          setEmail(data.data.email);
        } else {
          throw new Error('Login session creation failed');
        }
      } catch (error) {
        notify('Login failed. Please try again.', { status: 'error' });
      }
      notify('Verify OTP success');
      setVerify(false);
      setEmail(null);
      if (selected === undefined || selected === 'regular') {
        sessionStorage.setItem(storage.QUX_PAY_USER_DETAILS, JSON.stringify(data.data));
        sessionStorage.setItem(storage.QUX_PAY_USER_TOKEN, data.data.token);
        setUser(JSON.parse(sessionStorage.QUX_PAY_USER_DETAILS));
        if (!data.data.corporate_approved) {
          const redirectUrl = params?.t ? '/checkout' : '/dashboard';
          void router.push(redirectUrl);
        } else {
          setVisible(true);
        }
      }
    },
    onError: ({ response }: any) => {
      notify(response?.data?.status?.message || response?.data?.errors?.otp, { status: 'error' });
    },
  });

  const { mutateAsync: resend, isPending: isResending } = useMutation({
    mutationFn: (variable) => api.post('web/otp/resend', variable),
    onSuccess: () => {
      notify('Resend login OTP success');
    },
    onError: ({ response }: any) => {
      notify(response?.data?.status?.message, { status: 'error' });
    },
  });

  return { verify, resend, isVerifying, isResending };
};
