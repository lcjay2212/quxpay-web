import forge from 'node-forge';
import { notify } from './notify';

export const decryptDetails = (details: string[], key: string): any => {
  try {
    const privateKey = forge.pki.privateKeyFromPem(key);

    let detailsContent = '';

    details.forEach((content: string) => {
      try {
        const decodedContent = forge.util.decode64(content);
        const decryptedContent = privateKey.decrypt(decodedContent, 'RSA-OAEP');

        detailsContent += decryptedContent;
      } catch (error) {
        notify(`${error.message}`, { status: 'error' });
      }
    });

    // Parse the decrypted content and return it
    return JSON.parse(detailsContent);
  } catch (error) {
    notify(error.message, { status: 'error' });
  }
};
