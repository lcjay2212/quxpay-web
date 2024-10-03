/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { STAGING_URL } from 'constants/url';
import { camelCase } from 'lodash';
import { clearStorage, notify } from 'utils';
import { getDecryptedData } from 'utils/getDecryptedData';
import { useDecryptedBalance } from './useDecryptedBalance';
import { useDecryptedCoreBalance } from './useDecryptedCoreBalance';
import { useDecryptedCoreWallet } from './useDecryptedCoreWallet';
import { useDecryptedUserBanks } from './useDecryptedUserBanks';
import { useUser } from './useUser';

interface UseSecurityMainFileResult {
  dataLoading: boolean;
  error: unknown;
}

export const useDecryptedData = (type: string): UseSecurityMainFileResult => {
  const { setUser } = useUser();

  const setDecryptedBalance = useDecryptedBalance((e) => e.setDecryptedBalance);
  const setCoreBalance = useDecryptedCoreBalance((e) => e.setCoreBalance);
  const setCoreWallets = useDecryptedCoreWallet((e) => e.setCoreWallets);
  const setBanksDetails = useDecryptedUserBanks((e) => e.setBankDetails);

  const { isLoading: dataLoading, error } = useQuery({
    queryKey: [`${camelCase(type)}SecurityFile`],
    queryFn: async () => {
      try {
        const response = await axios.get(`${STAGING_URL}/web/encryption/main-file`, {
          params: { type },
          headers: {
            Authorization: `Bearer ${
              typeof window !== 'undefined' ? sessionStorage.getItem('QUX_PAY_USER_TOKEN') : ''
            }`,
            'Content-Type': 'application/json',
            Version: '2',
          },
        });

        if (response.data.data) {
          const { details, masterPublicKey, encryptedMainKey, decryptedMainKey, iv, key, userPublicKeyPem } =
            await getDecryptedData(response.data.data);

          const initialData = {
            details,
            masterPublicKey,
            encryptedMainKey,
            decryptedMainKey,
            iv,
            key,
            userPublicKeyPem,
          };

          if (type === 'balance') {
            const balance = JSON.parse(details.core);
            setCoreBalance(initialData);
            setDecryptedBalance(balance);
          }

          if (type === 'wallets') {
            const banks = JSON.parse(details.core);

            setCoreWallets(initialData);
            setBanksDetails(banks);
          }
        }

        return response.data.data;
      } catch (error) {
        if (error.response.status === 401) {
          clearStorage();
          setUser(null);
          notify(`${error.message}`, { status: 'error' });
        }
        notify(`${error.message}`, { status: 'error' });
      }
    },
    refetchInterval: 60000,
  });

  return { dataLoading, error };
};
