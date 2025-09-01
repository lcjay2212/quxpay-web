import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { ApiError, LoginRequest, LoginResponse } from 'constants/api';
import { notify } from 'utils';
import api from 'utils/api';
import { useCaptchaModal } from '../../store/useCaptchaModal';
import { usePendingAccountModal } from '../../store/usePendingAccountModal';
export const useLogin = (): { login: UseMutationResult<LoginResponse, ApiError, LoginRequest> } => {
  const setVisible = usePendingAccountModal((e) => e.setVisible);
  const setCaptchaModalVisible = useCaptchaModal((e) => e.setVisible);

  const login = useMutation({
    mutationKey: ['login'],
    mutationFn: async (credentials: LoginRequest) => {
      const { data } = await api.post('web/login', credentials, {
        headers: {
          'Site-Url': 'quxpay',
        },
      });
      return data.data;
    },
    onSuccess: () => {
      setCaptchaModalVisible(true);
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
