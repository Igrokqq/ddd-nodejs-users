import { Result } from "@shared/core/Result";
import { UseCaseError } from "@shared/core/UseCaseError";

export namespace LoginErrors {
  export class UserIncorrectEmail extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, `The user with ${email} email was not found`);
    }
  }
}
