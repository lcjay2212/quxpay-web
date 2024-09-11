import { rsaEncrypt } from './rsaEncrypt';

interface Details {
  masterPublicKey: string;
  masterPrivateKey: string;
  decryptedMainKey: string;
  iv: string;
  encryptedMainKey: string;
  key: string;
}

export const encryptData = (
  content: string,
  details: Details,
  type: string
): { file: string; encrypted_main_key: string; decrypted_main_key: string; iv: string; key: string; type: string } => {
  const masterPublicKey = details.masterPublicKey;

  const encryptedArray = rsaEncrypt(content, masterPublicKey);

  return {
    file: JSON.stringify(encryptedArray),
    encrypted_main_key: details.encryptedMainKey,
    decrypted_main_key: details.decryptedMainKey,
    iv: details.iv,
    key: details.key,
    type,
  };
};
