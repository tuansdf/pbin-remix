import { LoadingOverlay } from "@mantine/core";
import classes from "./screen-loading.module.scss";

type Props = {
  isLoading?: boolean;
};

export const ScreenLoading = ({ isLoading = true }: Props) => {
  if (!isLoading) return null;

  return (
    <>
      <div className={classes["container"]}>
        <LoadingOverlay visible={isLoading} />
      </div>
    </>
  );
};
