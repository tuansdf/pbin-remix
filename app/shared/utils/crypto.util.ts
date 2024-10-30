import { HashConfigs } from "@/server/features/vault/vault.type";
import {
  DEFAULT_HASHER,
  DEFAULT_ITERATIONS,
  DEFAULT_KEY_SIZE,
  DEFAULT_NONCE_SIZE,
  DEFAULT_NOTE_ID_SIZE,
  DEFAULT_PASSWORD_SIZE,
  DEFAULT_SALT_SIZE,
  ID_ALPHABET,
} from "@/shared/constants/common.constant";
import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import {
  bytesToHex,
  bytesToUtf8,
  hexToBytes,
  utf8ToBytes,
} from "@noble/ciphers/utils";
import { randomBytes } from "@noble/ciphers/webcrypto";
import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha2";
import { base64 } from "@scure/base";
import { customAlphabet } from "nanoid";

export const encryptText = async (
  contentStr: string,
  passwordHex: string,
  nonceHex: string
): Promise<string> => {
  const start = performance.now();
  try {
    const nonce = hexToBytes(nonceHex);
    const password = hexToBytes(passwordHex);
    const cipher = xchacha20poly1305(password, nonce);
    const content = utf8ToBytes(contentStr);
    const encrypted = cipher.encrypt(content);
    return base64.encode(encrypted);
  } catch (e) {
    return "";
  } finally {
    console.info("EPERF: " + (performance.now() - start) + " ms");
  }
};

export const decryptText = async (
  content64: string,
  passwordHex: string,
  nonceHex: string
): Promise<string> => {
  const start = performance.now();
  try {
    const content = base64.decode(content64);
    const password = hexToBytes(passwordHex);
    const nonce = hexToBytes(nonceHex);
    const cipher = xchacha20poly1305(password, nonce);
    const decrypted = cipher.decrypt(content);
    return bytesToUtf8(decrypted);
  } catch (e) {
    return "";
  } finally {
    console.info("DPERF: " + (performance.now() - start) + " ms");
  }
};

export const generateEncryptionConfigs = () => {
  return {
    nonce: bytesToHex(randomBytes(DEFAULT_NONCE_SIZE)),
  };
};

const idNano = customAlphabet(ID_ALPHABET, DEFAULT_NOTE_ID_SIZE);
export const generateId = (size: number = DEFAULT_NOTE_ID_SIZE) => {
  return idNano(size);
};

export const generatePassword = (size: number = DEFAULT_PASSWORD_SIZE) => {
  return bytesToHex(randomBytes(size));
};

export const generateHashConfigsWithSalt = (salt: string): HashConfigs => {
  let iterations = DEFAULT_ITERATIONS;
  let keySize = DEFAULT_KEY_SIZE;
  let hasher = DEFAULT_HASHER;
  return { keySize, iterations, salt, hasher };
};
export const generateHashConfigs = (): HashConfigs => {
  let iterations = DEFAULT_ITERATIONS;
  let keySize = DEFAULT_KEY_SIZE;
  let saltSize = DEFAULT_SALT_SIZE;
  let hasher = DEFAULT_HASHER;
  let salt = bytesToHex(randomBytes(saltSize));
  return { keySize, iterations, salt, hasher };
};

export const hashPassword = async (
  passwordStr: string,
  configs: HashConfigs
): Promise<string> => {
  const start = performance.now();
  try {
    await new Promise((r) => setTimeout(r, 100));
    const hashed = await pbkdf2Async(
      sha256,
      utf8ToBytes(passwordStr),
      hexToBytes(String(configs.salt)),
      {
        c: Number(configs.iterations),
        dkLen: Number(configs.keySize),
      }
    );
    return bytesToHex(hashed);
  } catch {
    return passwordStr;
  } finally {
    console.info("HPERF: " + (performance.now() - start) + " ms");
  }
};

export const createHash = async (input: string): Promise<string> => {
  try {
    return bytesToHex(sha256(input));
  } catch {
    return "";
  }
};

export const createHashSync = (input: string): string => {
  try {
    return bytesToHex(sha256(input));
  } catch {
    return "";
  }
};
