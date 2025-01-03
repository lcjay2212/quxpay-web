import forge from 'node-forge';
import { aes256Decrypt } from './aes256Decrypt';
import { notify } from './notify';

type DecryptionResult = string | null;

export const decryptMainKey = (
  encryptedMainKey: string,
  privateKeyPem: string,
  key: string,
  ivBase64: string,
  password?: string
): DecryptionResult => {
  try {
    // Convert the encrypted main key to a Buffer
    const encryptedMessage = Buffer.from(encryptedMainKey, 'base64');

    // Convert private key PEM to node-forge format
    const privateKey = forge.pki.decryptRsaPrivateKey(privateKeyPem, password);

    // Decrypt the AES key using RSA with RSA-OAEP padding
    const decryptedMessageBase64 = privateKey.decrypt(encryptedMessage, 'RSA-OAEP');

    // Decode the Base64-encoded AES-encrypted message
    const decodedMessage = forge.util.decode64(decryptedMessageBase64);

    // Decode the IV
    const iv = forge.util.decode64(ivBase64);

    // Decrypt the AES-encrypted message
    const mainKey = aes256Decrypt(decodedMessage, key, iv);

    return mainKey;
  } catch (error) {
    notify(`Decryption failed: ${error}`, { status: 'error' });
    return null;
  }
};
