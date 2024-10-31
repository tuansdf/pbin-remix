import { ErrorMessage } from "@/client/components/error";
import { ScreenLoading } from "@/client/components/screen-loading";
import { VaultDeleteModal } from "@/client/features/vaults/vault-delete-modal";
import { VaultConfigs } from "@/.server/features/vault/vault.type";
import { decryptText } from "@/shared/utils/crypto.util";
import { Button, Group, Textarea } from "@mantine/core";
import { Link, useParams } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";

type Props = {
  item: {
    content: string | null;
    configs?: VaultConfigs;
  };
};

export const NoteDetail = ({ item }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [decrypted, setDecrypted] = useState<string | undefined>();
  const { id } = useParams<{ id: string }>();

  const decryptContent = useCallback(async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      const password = window.location.hash?.substring(1);
      if (!password) return "";
      const decrypted = await decryptText(item.content || "", password, String(item.configs?.encryption.nonce));
      setDecrypted(decrypted || "");
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [item.content, item.configs?.encryption.nonce]);

  useEffect(() => {
    decryptContent();
  }, [decryptContent]);

  if (isLoading) return <ScreenLoading isLoading={isLoading} />;
  if (isError) return <ErrorMessage />;

  return (
    <>
      <Group mb="md">
        <Button component={Link} to="/create-note">
          New paste
        </Button>
        <VaultDeleteModal id={id || ""} />
      </Group>
      <form>{decrypted ? <Textarea value={decrypted} readOnly rows={30} /> : <ErrorMessage />}</form>
    </>
  );
};
