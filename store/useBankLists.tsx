import { FETCH_BANK_LIST } from 'constants/api';
import { useQuery } from 'react-query';
import { errorHandler } from 'utils';

export const useBankLists = (
  searchText: string,
  routingNumber?: string
): {
  data: any;
  isLoading: boolean;
  refetch: any;
} => {
  const { data, isLoading, refetch } = useQuery(['bankList', searchText, routingNumber], FETCH_BANK_LIST, errorHandler);

  return {
    data: data,
    isLoading,
    refetch,
  };
};
