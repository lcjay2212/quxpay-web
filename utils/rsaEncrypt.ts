import forge from 'node-forge';
import { notify } from './notify';

export const rsaEncrypt = (content: string, publicKeyPem: string): string[] | null => {
  const strSplit = (string: string, chunkSize: number): string[] =>
    Array.from({ length: Math.ceil(string.length / chunkSize) }, (_, i) =>
      string.slice(i * chunkSize, (i + 1) * chunkSize)
    );
  try {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const chunks = strSplit(content, 450);

    return chunks
      .map((chunk) => {
        try {
          const encryptedContent = publicKey.encrypt(chunk, 'RSA-OAEP');
          return forge.util.encode64(encryptedContent);
        } catch (error) {
          notify(`Encryption failed for chunk: ${error.message}`, { status: 'error' });
          return null;
        }
      })
      .filter((item) => item !== null);
  } catch (error) {
    notify(`RSA encryption error: ${error.message}`, { status: 'error' });
    return null;
  }
};
