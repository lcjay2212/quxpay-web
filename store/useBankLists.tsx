import { FETCH_BANK_LIST } from 'constants/api';
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';

export const useBankLists = (
  searchText: string
): {
  data: any;
  isLoading: boolean;
} => {
  const { data, isLoading } = useQuery(['bankList', searchText], FETCH_BANK_LIST, errorHandler);
  return {
    data: data,
    isLoading,
  };
};
