import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { post } from 'constants/api';
import storage from 'constants/storage';
import { API_SESSION_URL } from 'constants/url';
import { useRouter } from 'next/router';
import { notify } from 'utils';
import { usePendingAccountModal } from './usePendingAccountModal';
import { useRouteParams } from './useRouteParams';
import { useUser } from './useUser';
import { useVerifyOtp } from './useVerifyOtp';

export const useLogin = (): { login: UseMutationResult } => {
  const router = useRouter();
  const params = useRouteParams((e) => e.params);
  const setUser = useUser((e) => e.setUser);
  const setVisible = usePendingAccountModal((e) => e.setVisible);
  const setVerify = useVerifyOtp((e) => e.setVerify);

  const login = useMutation({
    mutationKey: ['login'],
    mutationFn: (variable) => post('web/login', variable),
    onSuccess: async ({ data }) => {
      notify(`${data.status.message}`);

      const loginSession = await fetch(`${API_SESSION_URL}/api/login?token=${data.data.token}`);
      const json = await loginSession.json();

      if (!data?.data?.show_verification_page) {
        if (json.success) {
          sessionStorage.setItem(storage.QUX_PAY_USER_DETAILS, JSON.stringify(data.data));
          sessionStorage.setItem(storage.QUX_PAY_USER_TOKEN, data.data.token);
          setUser(JSON.parse(sessionStorage.QUX_PAY_USER_DETAILS));
        } else {
          throw new Error('Something went wrong');
        }

        const redirectUrl = params?.t ? '/checkout' : '/dashboard';
        void router.push(redirectUrl);
      } else {
        setVerify(true);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: ({ response }: any) => {
      const message = response?.data?.data?.message;

      if (message === 'These credentials do not match our records.') {
        notify(response?.data?.data?.messages || message, { status: 'error' });
      } else if (message === 'Account pending.') {
        setVisible(true);
      } else {
        notify('These credentials do not match our records.', { status: 'error' });
      }
    },
  });

  return { login };
};
