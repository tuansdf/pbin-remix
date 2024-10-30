import { useAppStore } from "@/client/stores/app.store";
import { Alert, List } from "@mantine/core";
import { useMemo } from "react";

export const NoteHistory = () => {
  const { noteUrls } = useAppStore();

  const noteUrlsArr = useMemo(() => {
    if (!noteUrls) return;
    return Array.from(noteUrls);
  }, [noteUrls]);

  if (!noteUrlsArr) {
    return <Alert color="blue" title="Nothing..." />;
  }

  return (
    <List>
      {noteUrlsArr.map((item) => {
        if (!item) return null;
        return (
          <List.Item key={item}>
            <a target="_blank" href={item}>
              {item}
            </a>
          </List.Item>
        );
      })}
    </List>
  );
};
