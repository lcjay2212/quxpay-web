/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { STAGING_URL } from 'constants/url';
import { camelCase } from 'lodash';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { clearStorage, notify } from 'utils';
import { getDecryptedData } from 'utils/getDecryptedData';
import { useUser } from './useUser';

interface UseSecurityMainFileResult {
  dataLoading: boolean;
  data: any; // Replace `any` with a more specific type if possible
  error: unknown;
}

export const useDecryptedData = (type: string): UseSecurityMainFileResult => {
  const router = useRouter();
  const { setUser } = useUser();
  const [data, setData] = useState<{
    details: any;
    masterPublicKey: string;
    encryptedMainKey: string | null;
    decryptedMainKey: string | null;
    iv: string;
    key: string;
    userPublicKeyPem: string;
  } | null>(null);

  const { isLoading: dataLoading, error } = useQuery({
    queryKey: [`${camelCase(type)}SecurityFile`],
    queryFn: async () => {
      try {
        const response = await axios.get(`${STAGING_URL}/web/encryption/main-file`, {
          params: { type },
          headers: {
            Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('QUX_PAY_USER_TOKEN') : ''}`,
            'Content-Type': 'application/json',
            Version: '2',
          },
        });

        if (response.data.data) {
          const { details, masterPublicKey, encryptedMainKey, decryptedMainKey, iv, key, userPublicKeyPem } =
            await getDecryptedData(response.data.data);

          setData({
            details,
            masterPublicKey,
            encryptedMainKey,
            decryptedMainKey,
            iv,
            key,
            userPublicKeyPem,
          });
        }

        return response.data.data;
      } catch (error) {
        if (error.response.status === 401) {
          clearStorage();
          setUser(null);
          void router.push('/');
          notify(`${error.message}`, { status: 'error' });
        }
        notify(`${error.message}`, { status: 'error' });
      }
    },
  });

  return { dataLoading, data, error };
};
