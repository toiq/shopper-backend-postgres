import { ErrorCode, HttpException } from "@/exceptions/root";

export class UnauthorizedException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    super(message, errorCode, 401, errors);
  }
}
