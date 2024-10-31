import { VaultTable } from "@/.server/entities/vault.entity";

export type Vault = typeof VaultTable.$inferSelect;
export type VaultCreate = typeof VaultTable.$inferInsert;

export type HashConfigs = {
  keySize?: number;
  iterations?: number;
  salt?: string;
  hasher?: string;
};

export type EncryptionConfigs = {
  nonce: string;
};

export type VaultConfigs = {
  hash: HashConfigs;
  encryption: EncryptionConfigs;
};

export type CreateVaultRequest = {
  content: string;
  configs: VaultConfigs;
  expiresAt?: number;
  masterPassword?: string;
  guestPassword?: string;
};

export type CreateVaultResponse = {
  publicId: string;
};

export type CreateVaultFormValues = {
  content?: string;
  password?: string;
  masterPassword?: string;
  expiresAt?: number;
};

export type DeleteVaultRequest = {
  password: string;
  raw?: string;
};

export type DeleteVaultFormValues = {
  password: string;
};

export type DecryptVaultFormValues = {
  password: string;
};
