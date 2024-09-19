import { rsaEncrypt } from './rsaEncrypt';

interface Details {
  masterPublicKey: string;
  decryptedMainKey: string;
  iv: string;
  encryptedMainKey: string;
  key: string;
  details: {
    master_public_key: string;
    core: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changes: any;
    signature: string;
  };
}

export const encryptData = (
  content: string,
  details: Details,
  type: string
): { file: string; encrypted_main_key: string; decrypted_main_key: string; iv: string; key: string; type: string } => {
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
