/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { decryptData } from './decryptData';
import { decryptDetails } from './decryptDetails';
import { decryptMainKey } from './decryptMainKey';
import { queryClient } from './queryClient';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getDecryptedData = async (encryptedData) => {
  const { data: privateKeyPem } = await queryClient.fetchQuery({
    queryKey: ['userPrivateKey'],
    queryFn: async () => await axios.get(`${encryptedData.user_private_key}`),
  });

  const key = encryptedData?.key;
  const iv = encryptedData?.iv;
  const encryptedMainKey = encryptedData?.encrypted_main_key;
  const urls = encryptedData?.main_file_path;

  const mainKey = decryptMainKey(encryptedMainKey, privateKeyPem, key, iv);

  const fetchUrls = async (): Promise<void> => {
    const responses = await Promise.all(
      urls.map(async (urlObject) => {
        const key = Object.keys(urlObject)[0]; // Get the key (e.g., "balance")
        const url = urlObject[key]; // Get the URL
        const response = await fetch(url);

        // Assuming the response is JSON, but you can modify as needed
        const data = await response.json();

        return { [key]: data }; // Return the key and the fetched data
      })
    );

    return responses as any;
  };

  const data = await queryClient.fetchQuery({
    queryKey: ['userDecryptedData'],
    queryFn: fetchUrls,
  });

  const balanceFile = decryptData(data[0]?.balance, privateKeyPem, `${mainKey}`, iv);

  const masterKey = balanceFile?.master_key;
  const details = JSON.parse(balanceFile?.details);

  const decryptedDetails = decryptDetails(details, masterKey);

  return {
    balance: decryptedDetails,
  };
};
