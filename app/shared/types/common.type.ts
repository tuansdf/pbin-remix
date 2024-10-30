import { StatusCode } from "@/shared/types/status-code.type";

export type SearchObject = Record<string, string | number>;

export type ErrorResponse = {
  message?: string;
  status?: StatusCode;
};
