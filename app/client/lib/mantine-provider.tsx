import { createTheme, MantineProvider as MantineProviderM } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { PropsWithChildren } from "react";

const theme = createTheme({});

type Props = PropsWithChildren;

export const MantineProvider = ({ children }: Props) => {
  return (
    <MantineProviderM theme={theme} defaultColorScheme="dark">
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProviderM>
  );
};
