/**
 * Crypto Configuration for CSP Compliance
 * Uses native Web Crypto API to ensure Content Security Policy compliance
 * Following PITCHGUARD LITE rules: no third-party encryption libraries
 */

// Utility functions for ArrayBuffer/Base64 conversion
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

// CSP-compliant AES-GCM encryption
export const encryptData = async (data: string, keyBase64?: string): Promise<{ encrypted: string; key: string; iv: string }> => {
  try {
    let key: CryptoKey;
    
    if (keyBase64) {
      // Import existing key
      const keyBuffer = base64ToArrayBuffer(keyBase64);
      key = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );
    } else {
      // Generate new key
      key = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    }

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      dataBuffer
    );

    const exportedKey = await window.crypto.subtle.exportKey('raw', key);

    return {
      encrypted: arrayBufferToBase64(encrypted),
      key: arrayBufferToBase64(exportedKey),
      iv: arrayBufferToBase64(iv.buffer)
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
};

// CSP-compliant AES-GCM decryption
export const decryptData = async (encryptedData: string, keyBase64: string, ivBase64: string): Promise<string> => {
  try {
    const keyBuffer = base64ToArrayBuffer(keyBase64);
    const ivBuffer = base64ToArrayBuffer(ivBase64);
    const encryptedBuffer = base64ToArrayBuffer(encryptedData);

    const key = await window.crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(ivBuffer) },
      key,
      encryptedBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed');
  }
};

// CSP-compliant hash generation
export const generateHash = async (data: string, algorithm: 'SHA-256' | 'SHA-512' = 'SHA-256'): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest(algorithm, dataBuffer);
    return arrayBufferToBase64(hashBuffer);
  } catch (error) {
    console.error('Hash generation error:', error);
    throw new Error('Hash generation failed');
  }
};

// CSP-compliant random key generation
export const generateRandomKey = (length: number = 32): string => {
  try {
    const randomBytes = window.crypto.getRandomValues(new Uint8Array(length));
    return arrayBufferToBase64(randomBytes.buffer);
  } catch (error) {
    console.error('Key generation error:', error);
    throw new Error('Key generation failed');
  }
};

// CSP-compliant HMAC generation
export const generateHMAC = async (data: string, keyBase64: string, algorithm: 'SHA-256' | 'SHA-512' = 'SHA-256'): Promise<string> => {
  try {
    const keyBuffer = base64ToArrayBuffer(keyBase64);
    const key = await window.crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'HMAC', hash: algorithm },
      false,
      ['sign']
    );

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const signature = await window.crypto.subtle.sign('HMAC', key, dataBuffer);
    
    return arrayBufferToBase64(signature);
  } catch (error) {
    console.error('HMAC generation error:', error);
    throw new Error('HMAC generation failed');
  }
};

// CSP-compliant base64 encoding/decoding
export const encodeBase64 = (data: string): string => {
  try {
    return btoa(unescape(encodeURIComponent(data)));
  } catch (error) {
    console.error('Base64 encoding error:', error);
    throw new Error('Base64 encoding failed');
  }
};

export const decodeBase64 = (encodedData: string): string => {
  try {
    return decodeURIComponent(escape(atob(encodedData)));
  } catch (error) {
    console.error('Base64 decoding error:', error);
    throw new Error('Base64 decoding failed');
  }
};

// CSP-compliant password-based key derivation
export const deriveKey = async (password: string, salt: string, iterations: number = 100000): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = encoder.encode(salt);

    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );

    return arrayBufferToBase64(derivedBits);
  } catch (error) {
    console.error('Key derivation error:', error);
    throw new Error('Key derivation failed');
  }
};

// CSP-compliant secure random salt generation
export const generateSalt = (length: number = 16): string => {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(length));
    return arrayBufferToBase64(salt.buffer);
  } catch (error) {
    console.error('Salt generation error:', error);
    throw new Error('Salt generation failed');
  }
};

// Secure data validation
export const validateEncryptedData = (data: string): boolean => {
  try {
    // Basic validation for base64 encoded data
    return typeof data === 'string' && data.length > 0 && /^[A-Za-z0-9+/=]+$/.test(data);
  } catch (error) {
    console.error('Data validation error:', error);
    return false;
  }
};

// Export crypto utilities
export const CryptoUtils = {
  encrypt: encryptData,
  decrypt: decryptData,
  hash: generateHash,
  generateKey: generateRandomKey,
  hmac: generateHMAC,
  encodeBase64,
  decodeBase64,
  deriveKey,
  generateSalt,
  validate: validateEncryptedData
};

export default CryptoUtils;
