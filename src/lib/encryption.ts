import CryptoJS from 'crypto-js';

// Interface for vault item data structure
export interface VaultItemData {
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

/**
 * Encrypt vault item data using AES encryption
 * @param data - The vault item data to encrypt
 * @param userPassword - User's password as encryption key
 * @returns Encrypted string
 */
export function encryptVaultItem(data: VaultItemData, userPassword: string): string {
  const jsonString = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(jsonString, userPassword).toString();
  return encrypted;
}

/**
 * Decrypt vault item data using AES decryption
 * @param encryptedData - The encrypted data string
 * @param userPassword - User's password as decryption key
 * @returns Decrypted vault item data
 */
export function decryptVaultItem(encryptedData: string, userPassword: string): VaultItemData {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, userPassword);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    throw new Error('Failed to decrypt vault item. Invalid password or corrupted data.');
  }
}

/**
 * Generate a secure random key for additional encryption layers
 * @returns Random 32-byte key
 */
export function generateEncryptionKey(): string {
  return CryptoJS.lib.WordArray.random(32).toString();
}

/**
 * Hash a password using SHA-256 (for additional security)
 * @param password - Password to hash
 * @returns Hashed password
 */
export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}
