import { Box, LoadingOverlay } from "@mantine/core";
import classes from "./screen-loading.module.scss";

type Props = {
  isLoading?: boolean;
};

export const ScreenLoading = ({ isLoading = true }: Props) => {
  if (!isLoading) return null;

  return (
    <>
      <Box className={classes["container"]}>
        <LoadingOverlay
          visible={isLoading}
          styles={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)", backdropFilter: "blur(2px)" } }}
        />
      </Box>
    </>
  );
};
