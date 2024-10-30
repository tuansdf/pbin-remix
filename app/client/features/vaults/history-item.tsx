import { Button, Card, Text } from "@mantine/core";
import { ReactNode } from "react";

type Props = {
  text?: ReactNode;
  onDelete?: () => void;
};

export const HistoryItem = ({ text, onDelete }: Props) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
      {typeof text === "string" ? <Text>{text}</Text> : text}

      <Button.Group mt="sm">
        <Button color="red" onClick={onDelete}>
          Delete
        </Button>
      </Button.Group>
    </Card>
  );
};
