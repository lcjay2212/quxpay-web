/* eslint-disable @typescript-eslint/no-explicit-any */
import { FETCH_POS_HISTORY } from 'constants/api';
import { useQuery } from 'react-query';
import { errorHandler } from 'utils';

const usePosHistory = (): {
  unpaidData: any;
  paidData: any;
  pluginData: any;
  received: any;
  created: any;
  isLoading: boolean;
  refetch: () => void;
} => {
  const { data, isLoading, refetch } = useQuery('posHistory', FETCH_POS_HISTORY, errorHandler);
  const unpaidData = data?.unpaid_or_open;
  const paidData = data?.paid;
  const pluginData = data?.test_po_from_plugin;
  const received = data?.open?.received;
  const created = data?.open?.created;
  return {
    unpaidData,
    paidData,
    pluginData,
    received,
    created,
    isLoading,
    refetch,
  };
};

export default usePosHistory;
