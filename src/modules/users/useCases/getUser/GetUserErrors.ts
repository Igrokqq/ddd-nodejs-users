import { Result } from "@shared/core/Result";
import { UseCaseError } from "@shared/core/UseCaseError";

export namespace GetUserErrors {
  export class UserNotFound extends Result<UseCaseError> {
    constructor(id: number) {
      super(false, {
        message: `The user with ${id} id is not existing...`,
      } as UseCaseError);
    }
  }
}
