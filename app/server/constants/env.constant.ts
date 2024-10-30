// private env
import path from "path";

export const ENV = {
  DB_URL:
    process.env.NODE_ENV === "development"
      ? process.env.DB_URL
      : path.join("..", "..", process.env.DB_URL || "resources/main.db"),
  SALT: process.env.SALT,
  SUPER_PASSWORD: process.env.SUPER_PASSWORD,
};
