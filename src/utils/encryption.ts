// Native Web Crypto API implementation for AES-256-GCM encryption
// Following PITCHGUARD LITE rules: no third-party encryption libraries

// Generate a random 256-bit key for AES encryption
const generateKey = async (): Promise<CryptoKey> => {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
};

// Generate secure random IV (96-bit for GCM)
const generateIV = (): Uint8Array => {
  return window.crypto.getRandomValues(new Uint8Array(12));
};

// Convert ArrayBuffer to base64 string
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Convert base64 string to ArrayBuffer
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

// Encrypt pitch data using AES-256-GCM
export const encryptPitch = async (pitch: string): Promise<{ encryptedData: string; key: string; iv: string }> => {
  const key = await generateKey();
  const iv = generateIV();
  const encoder = new TextEncoder();
  const data = encoder.encode(pitch);

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data
  );

  // Export key for transmission
  const exportedKey = await window.crypto.subtle.exportKey('raw', key);

  return {
    encryptedData: arrayBufferToBase64(encrypted),
    key: arrayBufferToBase64(exportedKey),
    iv: arrayBufferToBase64(iv.buffer)
  };
};

// Generate SHA-256 hash for integrity verification
export const generateSHA256Hash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  return arrayBufferToBase64(hashBuffer);
};

// Simulate secure pitch submission
export const submitPitch = async (encryptedPitch: { encryptedData: string; key: string; iv: string }) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate mock AI analysis results
  const mockResults = {
    scores: [
      { category: 'Market Opportunity', value: Math.floor(Math.random() * 3) + 7 },
      { category: 'Business Model', value: Math.floor(Math.random() * 3) + 6 },
      { category: 'Competitive Advantage', value: Math.floor(Math.random() * 3) + 7 },
      { category: 'Team Strength', value: Math.floor(Math.random() * 3) + 6 },
      { category: 'Financial Projections', value: Math.floor(Math.random() * 3) + 5 },
      { category: 'Scalability', value: Math.floor(Math.random() * 3) + 7 },
      { category: 'Risk Assessment', value: Math.floor(Math.random() * 3) + 6 },
      { category: 'Innovation Factor', value: Math.floor(Math.random() * 3) + 8 },
    ],
    timestamp: new Date().toISOString(),
    hashProof: await generateSHA256Hash(encryptedPitch.encryptedData)
  };

  // Calculate overall score
  const overallScore = Math.round(
    mockResults.scores.reduce((sum, score) => sum + score.value, 0) / mockResults.scores.length * 10
  ) / 10;

  return {
    ...mockResults,
    overallScore
  };
};

// Decrypt data (for client-side verification)
export const decryptData = async (encryptedData: string, keyBase64: string, ivBase64: string): Promise<string> => {
  const keyBuffer = base64ToArrayBuffer(keyBase64);
  const ivBuffer = base64ToArrayBuffer(ivBase64);
  const encryptedBuffer = base64ToArrayBuffer(encryptedData);

  // Import the key
  const key = await window.crypto.subtle.importKey(
    'raw',
    keyBuffer,
    {
      name: 'AES-GCM',
    },
    false,
    ['decrypt']
  );

  // Decrypt the data
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(ivBuffer),
    },
    key,
    encryptedBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};