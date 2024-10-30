import { useDisclosure } from "@/client/hooks/use-disclosure";
import { AppShell as AppShellM, Box, Burger, NavLink } from "@mantine/core";
import { Link, useLocation } from "@remix-run/react";
import { PropsWithChildren } from "react";
import classes from "./app-shell.module.scss";

type Props = PropsWithChildren;

export const AppShell = ({ children }: Props) => {
  const location = useLocation();
  const pathname = location.pathname;
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <AppShellM
      header={{ height: 52 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
    >
      <AppShellM.Header className={classes["header"]}>
        <Burger opened={opened} onClick={toggle} size="sm" />
        <div>Pbin</div>
      </AppShellM.Header>

      <AppShellM.Navbar p="sm">
        <NavLink
          to="/create-note"
          label="Create a note"
          component={Link}
          active={pathname === "/create-note"}
          onClick={close}
        />
        <NavLink
          to="/note-history"
          label="Note history"
          component={Link}
          active={pathname === "/note-history"}
          onClick={close}
        />
        <NavLink
          to="/create-link"
          label="Shorten a URL"
          component={Link}
          active={pathname === "/create-link"}
          onClick={close}
        />
        <NavLink
          to="/mask-link"
          label="Mask a URL"
          component={Link}
          active={pathname === "/mask-link"}
          onClick={close}
        />
        <NavLink
          to="/link-history"
          label="URL history"
          component={Link}
          active={pathname === "/link-history"}
          onClick={close}
        />
        <NavLink
          to="/password-history"
          label="Password history"
          component={Link}
          active={pathname === "/password-history"}
          onClick={close}
        />
      </AppShellM.Navbar>

      <AppShellM.Main>
        <Box maw="120rem" mx="auto">
          {children}
        </Box>
      </AppShellM.Main>
    </AppShellM>
  );
};
