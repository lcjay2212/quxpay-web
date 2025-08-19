import { useQuery } from '@tanstack/react-query';
import api from 'utils/api';

export const useBankStatus = (): {
  data?: {
    status: string;
    account_nickname: string;
    show_having_trouble: boolean;
    amounts: number[];
  };
  isLoading: boolean;
} => {
  const { data, isLoading } = useQuery({
    queryKey: ['bankStatus'],
    queryFn: async () => {
      const { data } = await api.get(`web/verify/bank-status`);
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
  };
};
