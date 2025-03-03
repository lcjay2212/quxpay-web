import forge from 'node-forge';
import { notify } from './notify';

export const aes256Encrypt = (plainText: string, key: string, iv: string): string | null => {
  try {
    // Create a forge cipher instance for encryption
    const cipher = forge.cipher.createCipher('AES-CBC', key);

    // Start encryption with the given IV
    cipher.start({ iv });

    // Update the cipher with the plaintext
    cipher.update(forge.util.createBuffer(plainText, 'utf8'));

    // Finalize the encryption
    const success = cipher.finish();

    // Return the encrypted text as a Base64 string
    return success ? forge.util.encode64(cipher.output.getBytes()) : null;
  } catch (error) {
    notify('Encryption error:', error.message);
    return null;
  }
};
