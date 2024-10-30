import { Alert, AlertProps } from "@mantine/core";

type Props = {
  msg?: string;
} & AlertProps;

export const ErrorMessage = ({ msg = "Something Went Wrong", ...props }: Props) => {
  return <Alert variant="light" color="red" title={msg} {...props} />;
};
