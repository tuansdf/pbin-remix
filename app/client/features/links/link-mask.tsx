import { createVault } from "@/client/api/vault.api";
import { ErrorMessage } from "@/client/components/error";
import { ScreenLoading } from "@/client/components/screen-loading";
import { useAppStore } from "@/client/stores/app.store";
import fclasses from "@/client/styles/form.module.scss";
import {
  DEFAULT_NOTE_ID_SIZE,
  VAULT_EXPIRE_1_DAY,
  VAULT_EXPIRE_1_HOUR,
  VAULT_EXPIRE_1_MONTH,
  VAULT_EXPIRE_1_WEEK,
} from "@/shared/constants/common.constant";
import { createLinkFormSchema } from "@/server/features/vault/vault.schema";
import { CreateVaultFormValues } from "@/server/features/vault/vault.type";
import {
  encryptText,
  generateEncryptionConfigs,
  generateHashConfigs,
  generateId,
  generatePassword,
  hashPassword,
} from "@/shared/utils/crypto.util";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CopyButton, Group, NativeSelect, PasswordInput, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { getVaultExpiresTime } from "@/shared/utils/common.util";

const defaultFormValues: CreateVaultFormValues = {
  content: "",
  password: "",
  masterPassword: "",
  expiresAt: VAULT_EXPIRE_1_WEEK,
};

export const LinkMask = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<CreateVaultFormValues>({
    defaultValues: defaultFormValues,
    reValidateMode: "onSubmit",
    resolver: zodResolver(createLinkFormSchema),
  });
  const { addPassword, addShortUrl } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [shortLink, setShortLink] = useState("");
  const [shortLinkWithPassword, setShortLinkWithPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit: SubmitHandler<CreateVaultFormValues> = async (data) => {
    try {
      setErrorMessage("");
      setIsLoading(true);
      const hashConfigs = generateHashConfigs();
      const encryptionConfigs = generateEncryptionConfigs();
      const promises = [
        data.password ? hashPassword(data.password, hashConfigs) : generatePassword(),
        data.masterPassword ? hashPassword(data.masterPassword, hashConfigs) : undefined,
      ] as const;
      const [password, masterPassword] = await Promise.all(promises);
      const encrypted = await encryptText(data.content!, password, encryptionConfigs.nonce);
      const guestPassword = generateId(DEFAULT_NOTE_ID_SIZE);
      const body = await createVault(
        {
          content: encrypted || "",
          configs: { hash: hashConfigs, encryption: encryptionConfigs },
          masterPassword,
          guestPassword,
          expiresAt: getVaultExpiresTime(Number(data.expiresAt)),
        },
        DEFAULT_NOTE_ID_SIZE,
      );
      addPassword(password);
      const shortLink = window.location.origin + `/s/${body.publicId}?${guestPassword}`;
      addShortUrl(shortLink);
      setShortLink(shortLink);
      setShortLinkWithPassword(shortLink + `#${password}`);
    } catch (e) {
      setErrorMessage("Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    reset();
    setShortLink("");
  };

  const isSubmitted = !!shortLink;

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
        maw="30rem"
        mb="md"
      >
        <Title>Mask a URL</Title>
        <TextInput
          autoComplete="off"
          autoFocus
          withAsterisk
          label="Original URL"
          readOnly={isSubmitted}
          {...register("content")}
          error={errors.content?.message}
        />
        {!isSubmitted && (
          <>
            <PasswordInput
              type="password"
              autoComplete="current-password"
              label="Master password"
              {...register("masterPassword")}
              error={errors.masterPassword?.message}
              description="To perform update/delete (optional)"
            />
            <NativeSelect label="Expires after" data={expireOptions} {...register("expiresAt")} />
          </>
        )}
        {isSubmitted && (
          <>
            <TextInput readOnly label="Masked URL" value={shortLinkWithPassword} />
            <Group>
              <Button component="a" href={shortLinkWithPassword} target="_blank" variant="default">
                Open
              </Button>
              <CopyButton value={shortLinkWithPassword}>
                {({ copied, copy }) => (
                  <Button color={copied ? "teal" : "blue"} onClick={copy}>
                    {copied ? "Copied URL" : "Copy URL"}
                  </Button>
                )}
              </CopyButton>
            </Group>
          </>
        )}
        {!isSubmitted && (
          <Button type="submit" w="max-content">
            Submit
          </Button>
        )}
        {isSubmitted && (
          <Button type="reset" w="max-content" onClick={resetForm}>
            Mask another
          </Button>
        )}
      </Card>

      <ScreenLoading isLoading={isLoading} />

      {!!errorMessage && <ErrorMessage msg={errorMessage} />}
    </>
  );
};

const expireOptions = [
  {
    value: String(VAULT_EXPIRE_1_HOUR),
    label: "1 hour",
  },
  {
    value: String(VAULT_EXPIRE_1_DAY),
    label: "1 day",
  },
  {
    value: String(VAULT_EXPIRE_1_WEEK),
    label: "1 week",
  },
  {
    value: String(VAULT_EXPIRE_1_MONTH),
    label: "1 month",
  },
];
