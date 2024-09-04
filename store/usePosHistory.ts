/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import { FETCH_POS_HISTORY } from 'constants/api';

export const usePosHistory = (): {
  unpaidData: any;
  paidData: any;
  pluginData: any;
  received: any;
  created: any;
  isLoading: boolean;
  refetch: () => void;
} => {
  const { data, isLoading, refetch } = useQuery({ queryKey: ['posHistory'], queryFn: FETCH_POS_HISTORY });
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
