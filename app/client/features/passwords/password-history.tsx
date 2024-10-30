import { HistoryItem } from "@/client/features/vaults/history-item";
import { useAppStore } from "@/client/stores/app.store";
import classes from "@/client/styles/history.module.scss";
import { Alert, CopyButton, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMemo } from "react";

export const PasswordHistory = () => {
  const { passwords, removePassword } = useAppStore();

  const passwordsArr = useMemo(() => {
    if (!passwords) return;
    return Array.from(passwords);
  }, [passwords]);

  if (!passwordsArr) {
    return <Alert color="blue" title="Nothing..." />;
  }

  const handleDelete = (item: string) => {
    modals.openConfirmModal({
      title: "Delete password",
      children: <Text size="sm">Are you sure you want to delete this password?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        removePassword(item);
      },
    });
  };

  return (
    <div className={classes["container"]}>
      {passwordsArr.map((item) => {
        if (!item) return null;
        return (
          <HistoryItem
            key={item}
            onDelete={() => handleDelete(item)}
            text={
              <CopyButton value={item} timeout={1000}>
                {({ copied, copy }) => {
                  return (
                    <Tooltip label={copied ? "Copied" : "Click to copy"}>
                      <Text truncate="end" onClick={copy} className={classes["text"]}>
                        {item}
                      </Text>
                    </Tooltip>
                  );
                }}
              </CopyButton>
            }
          />
        );
      })}
    </div>
  );
};
