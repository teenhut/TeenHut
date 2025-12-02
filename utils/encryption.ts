import CryptoJS from "crypto-js";

// In a real app, this key would be exchanged securely (e.g., via Diffie-Hellman)
// For this prototype, we'll use a hardcoded shared secret or derive it from the room ID
const SECRET_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "teenhut-secret-key-123";

export const encryptMessage = (
  text: string,
  key: string = SECRET_KEY
): string => {
  try {
    return CryptoJS.AES.encrypt(text, key).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    return text;
  }
};

export const decryptMessage = (
  encryptedText: string,
  key: string = SECRET_KEY
): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || encryptedText; // Return original if decryption fails (fallback)
  } catch (error) {
    console.error("Decryption failed:", error);
    return encryptedText;
  }
};
