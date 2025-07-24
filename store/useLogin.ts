import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { ApiError, LoginRequest, LoginResponse, post } from 'constants/api';
import { API_SESSION_URL } from 'constants/url';
import { notify } from 'utils';
import { useCaptchaModal } from './useCaptchaModal';
import { usePendingAccountModal } from './usePendingAccountModal';
import { useVerifyOtp } from './useVerifyOtp';

export const useLogin = (): { login: UseMutationResult<LoginResponse, ApiError, LoginRequest> } => {
  const setVisible = usePendingAccountModal((e) => e.setVisible);
  const { setType, setEmail } = useVerifyOtp();
  const setCaptchaModalVisible = useCaptchaModal((e) => e.setVisible);

  const login = useMutation({
    mutationKey: ['login'],
    mutationFn: (credentials: LoginRequest) => post<LoginResponse, LoginRequest>('web/login', credentials),
    onSuccess: async (response: LoginResponse) => {
      try {
        const loginSession = await fetch(`${API_SESSION_URL}/api/login?token=${response.data.token}`);
        const json = await loginSession.json();

        if (!response.data.show_verification_page) {
          if (json.success) {
            setCaptchaModalVisible(true);
            setEmail(response.data.email);
            setType(response.data.type);
          } else {
            throw new Error('Login session creation failed');
          }
        } else {
          setVisible(true);
        }
      } catch (error) {
        notify('Login failed. Please try again.', { status: 'error' });
      }
    },
    onError: (error: ApiError) => {
      // Check multiple possible error response structures
      const message =
        error.response?.data?.data?.message ||
        error.response?.data?.status?.message ||
        error.response?.data?.message ||
        error.message;
      const messages = error.response?.data?.data?.messages || error.response?.data?.messages;

      if (message === 'These credentials do not match our records.') {
        notify(messages || message, { status: 'error' });
      } else if (message === 'Account pending.') {
        setVisible(true);
      } else {
        notify(messages || message || 'Login failed. Please try again.', { status: 'error' });
      }
    },
  });

  return { login };
};
