import { mainApiInstance } from "@/client/api/main-api-instance";
import {
  CreateVaultRequest,
  CreateVaultResponse,
  DeleteVaultRequest,
  VaultConfigs,
} from "@/.server/features/vault/vault.type";

export const createVault = async (data: CreateVaultRequest, type: number) => {
  const response = await mainApiInstance.post<CreateVaultResponse>(`/api/vaults?type=${type}`, data);
  return response.data;
};

export const deleteVault = async (id: string, data: DeleteVaultRequest) => {
  const res = await mainApiInstance.post<null>(`/api/vaults/${id}/delete`, data);
  return res.data;
};

export const getVaultConfigs = async (id: string) => {
  const res = await mainApiInstance.get<VaultConfigs>(`/api/vaults/${id}/configs`);
  return res.data;
};
