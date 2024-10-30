import { HistoryItem } from "@/client/features/vaults/history-item";
import { useAppStore } from "@/client/stores/app.store";
import classes from "@/client/styles/history.module.scss";
import { Alert, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMemo } from "react";

export const LinkHistory = () => {
  const { shortUrls, removeShortUrl } = useAppStore();

  const shortUrlsArr = useMemo(() => {
    if (!shortUrls) return;
    return Array.from(shortUrls);
  }, [shortUrls]);

  if (!shortUrlsArr) {
    return <Alert color="blue" title="Nothing..." />;
  }

  const handleDelete = (item: string) => {
    modals.openConfirmModal({
      title: "Delete short link",
      children: <Text size="sm">Are you sure you want to delete this URL?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        removeShortUrl(item);
      },
    });
  };

  return (
    <div className={classes["container"]}>
      {shortUrlsArr.map((item) => {
        if (!item) return null;
        return (
          <HistoryItem
            key={item}
            onDelete={() => handleDelete(item)}
            text={
              <Text component="a" target="_blank" href={item} truncate="end" c="blue" td="underline">
                {item}
              </Text>
            }
          />
        );
      })}
    </div>
  );
};
