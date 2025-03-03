import { rsaEncrypt } from './rsaEncrypt';

export const encryptData = (
  content: string,
  details: Details,
  type: string
): {
  file: string;
  encrypted_main_key: string | null;
  decrypted_main_key: string | null;
  iv: string;
  key: string;
  type: string;
} => {
  const masterPublicKey = details.masterPublicKey;

  const innerLayerContent = {
    master_public_key: details.details.master_public_key,
    core: details.details.core,
    changes: JSON.parse(content),
    signature: details.details.signature,
  };

  const encryptedArray = rsaEncrypt(JSON.stringify(innerLayerContent), masterPublicKey);

  return {
    file: JSON.stringify(encryptedArray),
    encrypted_main_key: details.encryptedMainKey,
    decrypted_main_key: details.decryptedMainKey,
    iv: details.iv,
    key: details.key,
    type,
  };
};
