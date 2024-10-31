import { vaultService } from "@/.server/features/vault/vault.service";
import { exceptionUtils } from "@/shared/exceptions/exception.util";
import { json, LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const id = params.id || "";
    const result = await vaultService.getVaultConfigs(id);
    return json(result);
  } catch (e) {
    const [status, response] = exceptionUtils.getResponse(e as Error);
    return json(response, { status });
  }
};
