/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { decryptData } from './decryptData';
// import { decryptDetails } from './decryptDetails';
import { decryptMainKey } from './decryptMainKey';
import { queryClient } from './queryClient';

type DecryptedData = {
  details: any; // Define this more explicitly if you know the structure
  decryptedMainKey: string | null;
  encryptedMainKey: string;
  masterPublicKey: string;
  iv: string;
  key: string;
  userPublicKeyPem: string;
};
export const getDecryptedData = async (encryptedData: {
  user_private_key: string;
  user_public_key: string;
  key: string;
  iv: string;
  encrypted_main_key: string;
  main_file_path: string;
}): Promise<DecryptedData> => {
  const { data: userPrivateKeyPem } = await queryClient.fetchQuery({
    queryKey: ['userPrivateKey'],
    queryFn: async () => await axios.get(`${encryptedData.user_private_key}`),
  });

  const { data: userPublicKeyPem } = await queryClient.fetchQuery({
    queryKey: ['userPublicKey'],
    queryFn: async () => await axios.get(`${encryptedData.user_public_key}`),
  });

  const key = encryptedData.key;
  const iv = encryptedData.iv;
  const encryptedMainKey = encryptedData.encrypted_main_key;

  const mainKey = decryptMainKey(encryptedMainKey, userPrivateKeyPem, key, iv);

  const { data } = await queryClient.fetchQuery({
    queryKey: ['useEncrptedMainFile'],
    queryFn: async () => await axios.get(`${encryptedData.main_file_path}`),
  });

  const file = decryptData(data, userPrivateKeyPem, `${mainKey}`, iv);

  const masterPublicKey = file?.master_public_key;
  const core = JSON.parse(file?.core);

  return {
    details: core,
    decryptedMainKey: mainKey,
    encryptedMainKey,
    masterPublicKey,
    iv,
    key,
    userPublicKeyPem,
  };
};
