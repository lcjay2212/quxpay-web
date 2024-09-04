import { useQuery } from '@tanstack/react-query';
import { FETCH_BANK_LIST } from 'constants/api';

export const useBankLists = (
  searchText: string,
  routingNumber?: string
): {
  data: any;
  isLoading: boolean;
  refetch: any;
} => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['bankList', searchText, routingNumber],
    queryFn: FETCH_BANK_LIST,
  });

  return {
    data: data,
    isLoading,
    refetch,
  };
};
