import { Result } from "./Result";
import { UseCaseError } from "./UseCaseError";

export class ValidationError extends Result<UseCaseError> {
  constructor(message: string) {
    super(false, {
      message,
    } as UseCaseError);
  }
}
