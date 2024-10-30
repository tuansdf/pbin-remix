import { PasswordHistory } from "@/client/features/passwords/password-history";
import { Title } from "@mantine/core";

export default function Page() {
  return (
    <>
      <Title mb="md">Password history</Title>

      <PasswordHistory />
    </>
  );
}
