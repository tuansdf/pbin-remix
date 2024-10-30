import { deleteVault, getVaultConfigs } from "@/client/api/vault.api";
import { ErrorMessage } from "@/client/components/error";
import { ScreenLoading } from "@/client/components/screen-loading";
import { useDisclosure } from "@/client/hooks/use-disclosure";
import { deleteVaultFormSchema } from "@/server/features/vault/vault.schema";
import { DeleteVaultFormValues } from "@/server/features/vault/vault.type";
import { generateHashConfigsWithSalt, hashPassword } from "@/shared/utils/crypto.util";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal, PasswordInput } from "@mantine/core";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";

type Props = {
  id: string;
};

export const VaultDeleteModal = ({ id }: Props) => {
  const router = useNavigate();
  const [opened, { close, open }] = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<DeleteVaultFormValues>({
    defaultValues: {
      password: "",
    },
    resolver: zodResolver(deleteVaultFormSchema),
  });

  const configsQuery = useSWR(`vault/${id}/configs`, id ? () => getVaultConfigs(id) : () => null);

  const handleFormSubmit: SubmitHandler<DeleteVaultFormValues> = async (data) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const password = await hashPassword(data.password, configsQuery.data?.hash!);
      const raw = await hashPassword(data.password, generateHashConfigsWithSalt(""));
      await deleteVault(id, { password, raw });
      router("/");
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={open} color="red">
        Delete
      </Button>

      <Modal opened={opened} onClose={close} title="Delete">
        {opened && (
          <Box pos="relative">
            <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
              <PasswordInput
                autoFocus
                label="Password"
                mb="md"
                autoComplete="current-password"
                withAsterisk
                {...register("password")}
                error={errors.password?.message}
              />
              <Button type="submit">Submit</Button>
            </Box>

            {isError && <ErrorMessage mt="md" />}
          </Box>
        )}
      </Modal>

      <ScreenLoading isLoading={isLoading || configsQuery.isLoading} />
    </>
  );
};
