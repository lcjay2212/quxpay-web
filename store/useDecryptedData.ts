/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FETCH_PASSPHASE } from 'constants/api';
import { camelCase } from 'lodash';
import { clearStorage, notify } from 'utils';
import { getDecryptedData } from 'utils/getDecryptedData';
import { useUser } from './useUser';

interface UseSecurityMainFileResult {
  dataLoading: boolean;
  error: unknown;
  data: any;
}

export const useDecryptedData = (type: string): UseSecurityMainFileResult => {
  const setUser = useUser((e) => e.setUser);

  const { data: passphrase } = useQuery({
    queryKey: ['passphrase'],
    queryFn: FETCH_PASSPHASE,
  });

  const {
    data,
    isLoading: dataLoading,
    error,
  } = useQuery({
    queryKey: [`${camelCase(type)}SecurityFile`],
    queryFn: async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/encryption/main-file`, {
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
          const {
            details,
            masterPublicKey,
            encryptedMainKey,
            decryptedMainKey,
            iv,
            key,
            userPublicKeyPem,
            transactions,
          } = await getDecryptedData(response.data.data, passphrase?.pass);

          const initialData = {
            details,
            masterPublicKey,
            encryptedMainKey,
            decryptedMainKey,
            iv,
            key,
            userPublicKeyPem,
          };
          switch (type) {
            case 'balance': {
              const balance = JSON.parse(details.core);
              return { initialData, balance }; // Return data for 'balance' type
            }

            case 'wallets': {
              const banks = JSON.parse(details.core);
              return { initialData, banks }; // Return data for 'wallets' type
            }

            case 'friends': {
              const { friends } = JSON.parse(details.core);
              return { initialData, friends }; // Return data for 'friends' type
            }

            case 'transactions': {
              return { initialData, transactions };
            }

            default:
              notify(`Unhandled type: ${type}`, { status: 'warning' });
              return null; // Return null if type is unhandled
          }
        }

        return response.data.data; // Fallback return if no specific case matches
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
    enabled: !!passphrase?.pass,
  });

  return { data, dataLoading, error };
};
