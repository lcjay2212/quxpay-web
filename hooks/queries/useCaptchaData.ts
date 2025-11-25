import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { notify } from 'utils';

interface CaptchaData {
  image: string;
  jigsaw_part_missing: string;
  captcha_id: string;
}

interface UseCaptchaDataProps {
  setVisible: (visible: boolean) => void;
}

export const useCaptchaData = ({
  setVisible,
}: UseCaptchaDataProps): {
  data: CaptchaData | null | undefined;
  isLoading: boolean;
  refetch: () => void;
  isRefetching: boolean;
} => {
  const { data, isLoading, refetch, isRefetching } = useQuery<CaptchaData | null>({
    queryKey: ['captcha'],
    queryFn: async () => {
      try {
        const { data: responseData } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/captcha`, {
          headers: {
            Version: 2,
          },
        });
        return responseData.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 500) {
            setVisible(false);
          }
          notify(error.response.data?.message || error.message, { status: 'error' });
        } else {
          notify('An unexpected error occurred.', { status: 'error' });
        }
        return null;
      }
    },
  });

  return {
    data,
    isLoading,
    refetch,
    isRefetching,
  };
};
