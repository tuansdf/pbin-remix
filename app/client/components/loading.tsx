import { Box, Loader } from "@mantine/core";

type Props = {
  isLoading?: boolean;
};

export const Loading = ({ isLoading = false }: Props) => {
  if (!isLoading) return null;

  return (
    <Box p="md">
      <Loader />
    </Box>
  );
};
