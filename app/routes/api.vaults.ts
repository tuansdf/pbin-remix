import { createVaultRequestSchema } from "@/server/features/vault/vault.schema";
import { vaultService } from "@/server/features/vault/vault.service";
import { exceptionUtils } from "@/shared/exceptions/exception.util";
import { ActionFunctionArgs, json } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const data = await createVaultRequestSchema.parseAsync(await request.json());
    const result = await vaultService.create(data, Number(searchParams.get("type")));
    return json(result);
  } catch (e) {
    const [status, response] = exceptionUtils.getResponse(e as Error);
    return json(response, { status });
  }
};
