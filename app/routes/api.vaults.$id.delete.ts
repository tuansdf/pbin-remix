import { deleteVaultSchema } from "@/server/features/vault/vault.schema";
import { vaultService } from "@/server/features/vault/vault.service";
import { exceptionUtils } from "@/shared/exceptions/exception.util";
import { ActionFunctionArgs, json } from "@remix-run/node";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const id = params.id || "";
    const data = await deleteVaultSchema.parseAsync(await request.json());
    await vaultService.deleteTopByPublicId(id, data);
    return json(null);
  } catch (e) {
    const [status, response] = exceptionUtils.getResponse(e as Error);
    return json(response, { status });
  }
};
