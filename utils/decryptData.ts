import forge from 'node-forge';
import { aes256Decrypt } from './aes256Decrypt';
import { notify } from './notify';

export const decryptData = (data: [] | undefined, privateKeyPem: string, mainKey: string, iv: string): any => {
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

  const message = forge.util.decode64(accumulatedContent);
  const ivBase64 = forge.util.decode64(iv);

  // Assuming aes256Decrypt is another utility function
  const mainFile = aes256Decrypt(message, `${mainKey}`, ivBase64);

  return JSON.parse(mainFile ?? '');
};
