import { ErrorMessage } from "@/client/components/error";
import { ScreenLoading } from "@/client/components/screen-loading";
import { useAppStore } from "@/client/stores/app.store";
import fclasses from "@/client/styles/form.module.scss";
import { decryptVaultFormSchema } from "@/shared/schemas/vault.schema";
import { DecryptVaultFormValues, EncryptionConfigs, VaultConfigs } from "@/.server/features/vault/vault.type";
import { decryptText, hashPassword } from "@/shared/utils/crypto.util";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, PasswordInput, Text, Title } from "@mantine/core";
import { Link } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {
  item: {
    content: string | null;
    configs?: VaultConfigs;
  };
};

const defaultFormValues: DecryptVaultFormValues = {
  password: "",
};

const decryptContent = async (
  content: string,
  passwords: Set<string | null | undefined>,
  configs?: EncryptionConfigs
): Promise<{ status: "success"; raw: string; password: string; url: string } | { status: "fail" }> => {
  if (!content || !passwords?.size) return { status: "fail" };
  try {
    const promises: ReturnType<typeof decryptText>[] = [];
    const passwordsArr = Array.from(passwords);
    passwordsArr.forEach((password) => {
      if (!password) return;
      promises.push(decryptText(content, password, String(configs?.nonce)));
    });
    const decryptedResult = await Promise.allSettled(promises);
    let decryptedContent = "";
    let decryptPassword = "";
    for (let i = 0; i < decryptedResult.length; i++) {
      const x = decryptedResult[i];
      if (x.status !== "fulfilled" || !x.value) continue;
      decryptedContent = x.value;
      decryptPassword = passwordsArr[i]!;
      break;
    }
    if (!decryptedContent) {
      return { status: "fail" };
    } else {
      if (!decryptedContent.startsWith("https://")) throw new Error();
      const url = new URL(decryptedContent);
      return { status: "success", raw: decryptedContent, password: decryptPassword, url: url.toString() };
    }
  } catch (e) {
    return { status: "fail" };
  }
};

export const LinkDetail = ({ item }: Props) => {
  const { passwords, addPassword, addShortUrl } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<DecryptVaultFormValues>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(decryptVaultFormSchema),
  });
  const [originalLink, setOriginalLink] = useState("");

  const autoDecryptContent = useCallback(async () => {
    setIsLoading(true);
    const passwordOnHash = window.location.hash.slice(1);
    const result = await decryptContent(
      item.content || "",
      new Set(passwords).add(passwordOnHash) || new Set(),
      item.configs?.encryption
    );
    if (result.status === "success") {
      setOriginalLink(result.url);
      return;
    }
    setIsLoading(false);
  }, [item.content, passwords, item.configs?.encryption]);

  const handleFormSubmit: SubmitHandler<DecryptVaultFormValues> = async (data) => {
    setIsError(false);
    setIsLoading(true);
    const shortUrl = window.location.origin + window.location.pathname;
    const rawResult = await decryptContent(item.content || "", new Set([data.password]), item.configs?.encryption);
    if (rawResult.status === "success") {
      addPassword(rawResult.password);
      addShortUrl(shortUrl);
      setOriginalLink(rawResult.url);
      return;
    }
    const password = await hashPassword(data.password, item.configs?.hash!);
    const hashedResult = await decryptContent(item.content || "", new Set([password]), item.configs?.encryption);
    if (hashedResult.status === "success") {
      addPassword(hashedResult.password);
      addShortUrl(shortUrl);
      setOriginalLink(hashedResult.url);
      return;
    }
    if (hashedResult.status === "fail") {
      setIsError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    autoDecryptContent();
  }, [autoDecryptContent]);

  if (isLoading && !originalLink) return <ScreenLoading isLoading={true} />;

  return (
    <>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        pos="relative"
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className={fclasses["form"]}
        maw="28rem"
        mb="md"
        style={{
          width: "100%",
          wordBreak: "break-all",
          overflowWrap: "break-word",
          hyphens: "auto",
          whiteSpace: "normal",
        }}
      >
        {!originalLink && (
          <>
            <Title order={2} ta="center">
              Unlock this link
            </Title>
            <PasswordInput label="Password" {...register("password")} error={errors.password?.message} withAsterisk />
            <Button type="submit" mt="xs">
              Submit
            </Button>
            {isError && <ErrorMessage mt="xs" />}
          </>
        )}
        {!!originalLink && (
          <>
            <Link to={originalLink} style={{ textAlign: "center" }}>
              {originalLink}
            </Link>
            <Text fw="bold" ta="center">
              Would you like to proceed?
            </Text>
            <Button component="a" href={originalLink} variant="filled">
              Continue
            </Button>
          </>
        )}
      </Card>
    </>
  );
};
