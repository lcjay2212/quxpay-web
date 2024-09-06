/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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

  const mainKey = decryptMainKey(encryptedMainKey, privateKeyPem, key, iv);

  const { data } = await queryClient.fetchQuery({
    queryKey: ['useEncrptedMainFile'],
    queryFn: async () => await axios.get(`${encryptedData.main_file_path}`),
  });

  const file = decryptData(data, privateKeyPem, `${mainKey}`, iv);

  const masterPrivateKey = file?.master_private_key;
  const details = JSON.parse(file?.details);

  const decryptedDetails = decryptDetails(details, masterPrivateKey);

  return {
    details: decryptedDetails,
  };
};
