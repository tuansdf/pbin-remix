import { generateId } from "@/shared/utils/crypto.util";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const VaultTable = sqliteTable(
  "vault",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    publicId: text("public_id", { mode: "text", length: 128 })
      .unique()
      .$defaultFn(() => generateId()),
    content: text("content", { mode: "text", length: 10000 }),
    masterPassword: text("master_password", { mode: "text", length: 128 }),
    guestPassword: text("guest_password", { mode: "text", length: 128 }),
    configs: text("configs", { mode: "text", length: 512 }),
    expiresAt: integer("expires_at", { mode: "number" }),
  },
  (table) => ({
    expiresAtIdx: index("vault_expires_at_idx").on(table.expiresAt),
  })
);
