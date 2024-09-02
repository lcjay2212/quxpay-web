import * as forge from 'node-forge';

export const aes256Decrypt = (encryptedText: string, key: string, iv: string): string | null => {
  try {
    // Create a forge cipher instance
    const decipher = forge.cipher.createDecipher('AES-CBC', key);
    // // Start decryption with the given IV
    decipher.start({ iv: iv });

    // // Update the cipher with the encrypted text
    decipher.update(forge.util.createBuffer(encryptedText));
    // // Finalize the decryption
    const success = decipher.finish();
    // // Return the decrypted text as a UTF-8 string
    return success ? decipher.output.toString('utf8') : null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Decryption error:', error.message);
    return null;
  }
};
