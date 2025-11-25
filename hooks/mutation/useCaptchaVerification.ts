import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback } from 'react';
import { notify } from 'utils';

interface CaptchaErrorResponse {
  response?: {
    data?: {
      status?: {
        message: string;
      };
    };
  };
}

interface CaptchaVerifyResponse {
  data?: {
    status?: {
      message: string;
    };
  };
}

interface CaptchaVerifyPayload {
  captcha_id: string;
  x: number;
  y: number;
}

interface UseCaptchaVerificationProps {
  label: 'login' | 'register';
  setVisible: (visible: boolean) => void;
  setVerify: (value: boolean) => void;
  resetPosition: () => void;
  refetch: () => void;
}

export const useCaptchaVerification = ({
  label,
  setVisible,
  setVerify,
  resetPosition,
  refetch,
}: UseCaptchaVerificationProps): { verify: (payload: CaptchaVerifyPayload) => void; isVerifying: boolean } => {
  const handleVerifySuccess = useCallback(
    ({ data }: CaptchaVerifyResponse): void => {
      notify(data?.status?.message || '');
      setVisible(false);
      if (label === 'login') {
        setVerify(true);
      }
    },
    [label, setVerify, setVisible]
  );

  const handleVerifyError = useCallback(
    ({ response }: CaptchaErrorResponse): void => {
      const { status } = response?.data || {};
      notify(status?.message || 'Verification failed', { status: 'error' });
      setVisible(false);
      resetPosition();
      void refetch();
    },
    [refetch, resetPosition, setVisible]
  );

  const { mutate, isPending: isVerifying } = useMutation({
    mutationKey: ['captchaVerify'],
    mutationFn: (payload: CaptchaVerifyPayload) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/captcha/verify`, payload, {
        headers: { Version: 2 },
      }),
    onSuccess: handleVerifySuccess,
    onError: handleVerifyError,
  });

  return {
    verify: mutate,
    isVerifying,
  };
};
