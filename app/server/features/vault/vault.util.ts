import { ENV } from "@/server/constants/env.constant";
import { vaultRepository } from "@/server/features/vault/vault.repository";
import { HashConfigs } from "@/server/features/vault/vault.type";
import {
  DEFAULT_HASHER,
  DEFAULT_ITERATIONS,
  DEFAULT_KEY_SIZE,
  FAKE_NONCE_SIZE,
  FAKE_SALT_SIZE,
  MAX_EXPIRES_TIME,
  MAX_ID_SIZE,
  MIN_EXPIRES_TIME,
  MIN_ID_SIZE,
} from "@/shared/constants/common.constant";
import { handleRetry } from "@/shared/utils/common.util";
import { createHash } from "@/shared/utils/crypto.util";
import { hexToBytes } from "@noble/ciphers/utils";
import { base64 } from "@scure/base";
import dayjs from "dayjs";

export const handleVaultPublicIdCollision = async (randomFn: () => string) => {
  return await handleRetry({
    resultFn: randomFn,
    shouldRetryFn: vaultRepository.existsByPublicId,
  });
};

export const getVaultExpiredTime = (expiresAt?: number): number => {
  let result = dayjs();
  if (!expiresAt) return result.valueOf();
  if (expiresAt < MIN_EXPIRES_TIME) expiresAt = MIN_EXPIRES_TIME;
  if (expiresAt > MAX_EXPIRES_TIME) expiresAt = MAX_EXPIRES_TIME;
  return result.add(expiresAt, "minute").valueOf();
};

export const getVaultIdSize = (type?: number): number => {
  if (!type || type > MAX_ID_SIZE) return MAX_ID_SIZE;
  if (type < MIN_ID_SIZE) return MIN_ID_SIZE;
  return type;
};

const createBase = async (base: string) => {
  return createHash(base + ENV.SALT);
};

const HEX_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const MIN_ROUNDS = 2;
const MAX_ROUNDS = 16;
const BASE_CONTENT_EXTRA = "content";
const BASE_SALT_EXTRA = "salt";
const BASE_ENCRYPTION_EXTRA = "encryption";
export const generateFakeContent = async (base: string, maxRounds: number = MAX_ROUNDS): Promise<string> => {
  base = (await createBase(base + BASE_CONTENT_EXTRA)).toLowerCase();
  let rounds = HEX_ALPHABET.indexOf(base[0]);
  if (rounds < MIN_ROUNDS) rounds = MIN_ROUNDS;
  if (rounds > maxRounds) rounds = maxRounds;
  rounds *= 2;
  const promises: Promise<string>[] = [];
  for (let i = 0; i < rounds; i++) {
    promises.push(createHash(base[i])); // select 1 character to shorten the hash input
  }
  const result = await Promise.all(promises);
  return base64.encode(hexToBytes(result.join("")));
};

export const generateFakeHashConfigs = async (base: string): Promise<HashConfigs> => {
  base = await createBase(base + BASE_SALT_EXTRA);
  let keySize = DEFAULT_KEY_SIZE;
  let iterations = DEFAULT_ITERATIONS;
  let hasher = DEFAULT_HASHER;
  let salt = (await createHash(base)).substring(0, FAKE_SALT_SIZE);
  return { keySize, iterations, salt, hasher };
};

export const generateFakeEncryptionConfigs = async (base: string) => {
  base = await createBase(base + BASE_ENCRYPTION_EXTRA);
  return {
    nonce: (await createHash(base)).substring(0, FAKE_NONCE_SIZE),
  };
};
