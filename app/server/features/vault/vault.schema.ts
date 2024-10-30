import {
  CreateVaultFormValues,
  CreateVaultRequest,
  DecryptVaultFormValues,
  DeleteVaultFormValues,
  DeleteVaultRequest,
  EncryptionConfigs,
  HashConfigs,
  VaultConfigs,
} from "@/server/features/vault/vault.type";
import { passwordSchema, stringOrUndefined } from "@/shared/schemas/common.schema";
import { z } from "zod";

const MAX_CONTENT_SERVER = 15000;
const MAX_CONTENT_CLIENT = 10000;

const passwordConfigsSchema: z.ZodType<HashConfigs> = z.object(
  {
    keySize: z
      .number({
        required_error: "Invalid key size",
        invalid_type_error: "Invalid key size",
      })
      .min(1, "Invalid key size"),
    iterations: z
      .number({
        required_error: "Invalid iterations",
        invalid_type_error: "Invalid iterations",
      })
      .min(1, "Invalid iterations"),
    salt: z
      .string({
        required_error: "Invalid salt",
        invalid_type_error: "Invalid salt",
      })
      .min(1, "Invalid salt"),
    hasher: z
      .string({
        required_error: "Invalid hasher",
        invalid_type_error: "Invalid hasher",
      })
      .min(1, "Invalid hasher"),
  },
  {
    required_error: "Password configs is required",
    invalid_type_error: "Invalid password configs",
  },
);

const encryptionConfigsSchema: z.ZodType<EncryptionConfigs> = z.object(
  {
    nonce: z
      .string({
        required_error: "Invalid nonce",
        invalid_type_error: "Invalid nonce",
      })
      .min(1, "Invalid salt"),
  },
  {
    required_error: "Encryption configs is required",
    invalid_type_error: "Invalid encryption configs",
  },
);

const vaultConfigsSchema: z.ZodType<VaultConfigs> = z.object(
  {
    hash: passwordConfigsSchema,
    encryption: encryptionConfigsSchema,
  },
  { required_error: "Configs is required", invalid_type_error: "Invalid configs" },
);

const idSchema = z
  .string({
    required_error: "Invalid ID",
    invalid_type_error: "Invalid ID",
  })
  .min(1, "Missing ID");
const contentSchema = z
  .string({
    required_error: "Invalid content",
    invalid_type_error: "Invalid content",
  })
  .min(1, "Missing content");
const urlSchema = z
  .string({
    required_error: "Invalid URL",
    invalid_type_error: "Invalid URL",
  })
  .startsWith("https://", "Invalid URL")
  .url("Invalid URL");

export const createVaultRequestSchema: z.ZodType<CreateVaultRequest> = z.object({
  content: contentSchema.max(MAX_CONTENT_SERVER, "Invalid content"),
  masterPassword: passwordSchema.optional(),
  guestPassword: z.string().optional(),
  configs: vaultConfigsSchema,
  expiresAt: z.coerce.number().optional(),
});

export const deleteVaultSchema: z.ZodType<DeleteVaultRequest> = z.object({
  password: passwordSchema,
  raw: passwordSchema.optional(),
});

export const deleteVaultFormSchema: z.ZodType<DeleteVaultFormValues> = z.object({
  password: passwordSchema,
});

export const createLinkFormSchema: z.ZodType<CreateVaultFormValues> = z.object({
  content: urlSchema,
  password: stringOrUndefined.pipe(passwordSchema.optional()),
  masterPassword: stringOrUndefined.pipe(passwordSchema.optional()),
  expiresAt: z.coerce.number().optional(),
});

export const createNoteFormSchema: z.ZodType<CreateVaultFormValues> = z.object({
  content: contentSchema.max(MAX_CONTENT_CLIENT, "Too long"),
  masterPassword: stringOrUndefined.pipe(passwordSchema.optional()),
  expiresAt: z.coerce.number().optional(),
});

export const decryptVaultFormSchema: z.ZodType<DecryptVaultFormValues> = z.object({
  password: passwordSchema,
});
