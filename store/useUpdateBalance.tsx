/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { queryClient } from 'utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateBalance = (newBalanceData: any): any => {
  queryClient.setQueryData(['balanceSecurityFile'], (oldData: any) => ({
    ...oldData,
    balance: {
      ...oldData.balance,
      ...newBalanceData,
    },
  }));
};
