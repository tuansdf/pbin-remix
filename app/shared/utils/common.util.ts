import {
  VAULT_EXPIRE_1_DAY,
  VAULT_EXPIRE_1_HOUR,
  VAULT_EXPIRE_1_MONTH,
  VAULT_EXPIRE_1_WEEK,
} from "@/shared/constants/common.constant";

const DEFAULT_MAX_RETRIES = 100;

export const handleRetry = async <T>({
  resultFn,
  shouldRetryFn,
  maxRetries = DEFAULT_MAX_RETRIES,
}: {
  resultFn: () => T | Promise<T>;
  shouldRetryFn: (text: T) => Promise<boolean>; // true: collision, false: no collision
  maxRetries?: number;
}): Promise<T> => {
  let retryCount = 0;
  let result: T | null = null;
  while (!result) {
    if (retryCount > maxRetries) {
      throw new Error("Cannot generate ID");
    }
    let temp: T | null = null;
    try {
      temp = await resultFn();
      const isRetry = await shouldRetryFn(temp);
      if (!isRetry) {
        result = temp;
      } else {
        console.error("Collision: " + temp);
      }
    } catch (e) {
      console.error("Collision: " + temp);
    }
    retryCount++;
  }
  return result;
};

// return in minutes
const expiresMap: Record<number, number> = {
  [VAULT_EXPIRE_1_HOUR]: 60,
  [VAULT_EXPIRE_1_DAY]: 60 * 24,
  [VAULT_EXPIRE_1_WEEK]: 60 * 24 * 7,
  [VAULT_EXPIRE_1_MONTH]: 60 * 24 * 30,
};
export const getVaultExpiresTime = (type: number): number => {
  let result = expiresMap[type];
  if (!result) return 1;
  return result;
};
