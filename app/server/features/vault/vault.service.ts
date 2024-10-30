import { ENV } from "@/server/constants/env.constant";
import { vaultRepository } from "@/server/features/vault/vault.repository";
import { CreateVaultRequest, DeleteVaultRequest, VaultConfigs } from "@/server/features/vault/vault.type";
import {
  generateFakeContent,
  generateFakeEncryptionConfigs,
  generateFakeHashConfigs,
  getVaultExpiredTime,
  getVaultIdSize,
  handleVaultPublicIdCollision,
} from "@/server/features/vault/vault.util";
import { DEFAULT_LINK_ID_SIZE } from "@/shared/constants/common.constant";
import { CustomException } from "@/shared/exceptions/custom-exception";
import { createHash, createHashSync, generateId, hashPassword } from "@/shared/utils/crypto.util";
import dayjs from "dayjs";

const HASHED_SUPER_PASSWORD = ENV.SUPER_PASSWORD ? createHashSync(ENV.SUPER_PASSWORD) : undefined;
const ID_REGEX = /^[a-zA-Z0-9]+$/;

class VaultService {
  public create = async (data: CreateVaultRequest, type: number) => {
    let expiresAt: number = getVaultExpiredTime(data.expiresAt);

    const publicId = await handleVaultPublicIdCollision(() => generateId(getVaultIdSize(type)));
    const hashedPassword = data.masterPassword ? await hashPassword(data.masterPassword, data.configs.hash) : undefined;
    await vaultRepository.create({
      publicId,
      content: data.content,
      masterPassword: hashedPassword,
      guestPassword: data.guestPassword,
      configs: JSON.stringify(data.configs),
      expiresAt,
    });
    return { publicId };
  };

  public getTopByPublicId = async (
    id: string,
    guestPassword?: string | null
  ): Promise<{ publicId: string; content: string | null; configs?: VaultConfigs } | null> => {
    if (!ID_REGEX.test(id)) return null;

    const vault = await vaultRepository.findTopByPublicId(id);
    if (!vault || (guestPassword && vault.guestPassword !== guestPassword)) {
      const base = id + (guestPassword || "");
      return {
        publicId: id,
        content: await generateFakeContent(base, id.length === DEFAULT_LINK_ID_SIZE ? 8 : undefined),
        configs: { hash: await generateFakeHashConfigs(base), encryption: await generateFakeEncryptionConfigs(base) },
      };
    }
    let configs = this.parseVaultConfigs(vault.configs!);

    return {
      publicId: id,
      content: vault.content,
      configs,
    };
  };

  public deleteExpiredVaults = async () => {
    const date = dayjs().valueOf();
    await vaultRepository.deleteAllExpiresAtBefore(date);
    return date;
  };

  private parseVaultConfigs = (configs?: string | null): VaultConfigs | undefined => {
    try {
      if (configs) {
        return JSON.parse(configs) as VaultConfigs;
      }
    } catch (e) {}
  };

  public getVaultConfigs = async (id: string): Promise<VaultConfigs> => {
    const vault = await vaultRepository.findTopByPublicId(id);
    if (!vault) {
      return {
        hash: await generateFakeHashConfigs(id),
        encryption: await generateFakeEncryptionConfigs(id),
      };
    }
    const configs = this.parseVaultConfigs(vault.configs);
    if (configs) return configs;
    return {
      hash: await generateFakeHashConfigs(id),
      encryption: await generateFakeEncryptionConfigs(id),
    };
  };

  public deleteTopByPublicId = async (id: string, data: DeleteVaultRequest) => {
    if (HASHED_SUPER_PASSWORD && data.raw && HASHED_SUPER_PASSWORD === (await createHash(data.raw))) {
      await vaultRepository.deleteByPublicId(id);
      return;
    }
    const vault = await vaultRepository.findTopByPublicId(id);
    if (!vault || !data.password) {
      throw new CustomException();
    }
    const reqPassword = await hashPassword(data.password, this.parseVaultConfigs(vault.configs!)?.hash!);
    if (vault.masterPassword !== reqPassword) {
      throw new CustomException();
    }
    await vaultRepository.deleteById(vault.id);
  };
}

export const vaultService = new VaultService();
