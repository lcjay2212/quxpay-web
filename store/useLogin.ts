import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { post } from 'constants/api';
import { API_SESSION_URL } from 'constants/url';
import { notify } from 'utils';
import { useCaptchaModal } from './useCaptchaModal';
import { usePendingAccountModal } from './usePendingAccountModal';
import { useVerifyOtp } from './useVerifyOtp';

export const useLogin = (): { login: UseMutationResult } => {
  const setVisible = usePendingAccountModal((e) => e.setVisible);
  const { setVerify, setType, setEmail } = useVerifyOtp();
  const setCaptchaModalVisible = useCaptchaModal((e) => e.setVisible);

  const login = useMutation({
    mutationKey: ['login'],
    mutationFn: (variable) => post('web/login', variable),
    onSuccess: async ({ data }) => {
      // notify(`${data.status.message}`);

      const loginSession = await fetch(`${API_SESSION_URL}/api/login?token=${data.data.token}`);
      const json = await loginSession.json();

      if (!data?.data?.show_verification_page) {
        if (json.success) {
          setCaptchaModalVisible(true);
          setEmail(data.data.email);
          setType(data.data.type);
        } else {
          throw new Error('Something went wrong');
        }
      } else {
        setVerify(true);
        setEmail(data.data.email);
        setType(data.data.type);
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
