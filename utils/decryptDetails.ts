import forge from 'node-forge';
import { notify } from './notify';

export const decryptDetails = (details: string[], masterKey: string): any => {
  const masterPrivateKey = forge.pki.privateKeyFromPem(masterKey);

  let detailsContent = '';

  details.forEach((content: string) => {
    try {
      const decodedContent = forge.util.decode64(content);
      const decryptedContent = masterPrivateKey.decrypt(decodedContent, 'RSA-OAEP');
      detailsContent += decryptedContent;
    } catch (error) {
      notify('Decryption failed for content:', { status: 'error' });
    }
  });

  // Parse the decrypted content and return it
  return JSON.parse(detailsContent);
};
