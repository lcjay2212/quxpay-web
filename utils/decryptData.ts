/* eslint-disable @typescript-eslint/no-explicit-any */
import forge from 'node-forge';
import { aes256Decrypt } from './aes256Decrypt';
import { notify } from './notify';

export const decryptData = (data: [] | undefined, privateKeyPem: string, mainKey: string, iv: string): any => {
  try {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    let accumulatedContent = '';

    data?.forEach((content: string) => {
      try {
        const decodedContent = forge.util.decode64(content);
        const decryptedContent = privateKey.decrypt(decodedContent, 'RSA-OAEP');
        accumulatedContent += decryptedContent;
      } catch (error) {
        notify('Decryption failed for content:', { status: 'error' });
      }
    });

    const outerData = JSON.parse(accumulatedContent);
    const ivBase64 = forge.util.decode64(iv);
    const innerAes = outerData?.inner_aes;
    const innerAesBase64 = forge.util.decode64(innerAes);

    // Assuming aes256Decrypt is another utility function
    const mainFile = aes256Decrypt(innerAesBase64, `${mainKey}`, ivBase64);

    return JSON.parse(mainFile ?? '');
  } catch (error) {
    notify(error.message, { status: 'error' });
  }
};
