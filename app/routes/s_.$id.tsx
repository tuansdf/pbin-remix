import { NotFound } from "@/client/components/not-found";
import { LinkDetail } from "@/client/features/links/link-detail";
import classes from "@/client/styles/link-detail.module.scss";
import { vaultService } from "@/.server/features/vault/vault.service";
import { Box } from "@mantine/core";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const vaultId = String(params.id);
  const guestPassword = Array.from(url.searchParams.keys())[0] || "";
  return json(await vaultService.getTopByPublicId(vaultId, guestPassword));
};

export default function Page() {
  const item = useLoaderData<typeof loader>();

  return (
    <>
      {!!item ? (
        <Box className={classes["container"]} bg="dark">
          <LinkDetail item={item} />
        </Box>
      ) : (
        <NotFound />
      )}
    </>
  );
}
