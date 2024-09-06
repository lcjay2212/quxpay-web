import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { STAGING_URL } from 'constants/url';
import { camelCase } from 'lodash';
import { useState } from 'react';
import { notify } from 'utils';
import { getDecryptedData } from 'utils/getDecryptedData';

interface UseSecurityMainFileResult {
  dataLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; // Replace `any` with a more specific type if possible
  error: unknown;
}

export const useDecryptedData = (type: string): UseSecurityMainFileResult => {
  const [data, setData] = useState(null);

  const { isLoading: dataLoading, error } = useQuery({
    queryKey: [`${camelCase(type)}SecurityFile`],
    queryFn: async () => {
      try {
        const response = await axios.get(`${STAGING_URL}/web/encryption/main-file`, {
          params: { type },
          headers: {
            Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('QUX_PAY_USER_TOKEN') : ''}`,
            Version: '2',
          },
        });
        if (response.data.data) {
          const { details } = await getDecryptedData(response.data.data);

          setData(details);
        }

        return response.data;
      } catch (error) {
        notify(`Error fetching or decrypting data`, { status: 'error' });
      }
    },
  });

  return { dataLoading, data, error };
};
