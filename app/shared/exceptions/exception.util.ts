import { CustomException } from "@/shared/exceptions/custom-exception";
import { ErrorResponse } from "@/shared/types/common.type";
import { StatusCode } from "@/shared/types/status-code.type";
import { ZodError } from "zod";

const defaultStatus = 500;
const defaultMessage = "Something Went Wrong";

class ExceptionUtils {
  public getResponse = (err: Error): [StatusCode, ErrorResponse] => {
    console.error(err);
    let status: StatusCode = defaultStatus;
    let message: string = defaultMessage;
    if (err instanceof CustomException) {
      status = err.status || 400;
      message = err.message || defaultMessage;
      return [status, { status, message }];
    }
    if (err instanceof ZodError) {
      status = 400;
      message = err.errors[0]?.message || defaultMessage;
      return [status, { status, message }];
    }
    return [status, { status, message }];
  };
}

export const exceptionUtils = new ExceptionUtils();
