import { StatusCode } from "@/shared/types/status-code.type";

export class CustomException extends Error {
  public status: StatusCode;

  constructor(message?: string, status?: StatusCode) {
    const s = status || 500;
    const m = message || "Something Went Wrong";
    super(m);
    this.status = s;

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
