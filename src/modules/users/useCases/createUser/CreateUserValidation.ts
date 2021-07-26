import { UserEmail } from "@modules/users/domain/userEmail";
import { UserFirstName } from "@modules/users/domain/userFirstName";
import { UserLastName } from "@modules/users/domain/userLastName";
import { Result } from "@shared/core/Result";
import { UseCaseValidationResult } from "@shared/core/UseCaseValidationResult";
import { CreateUserDTO } from "./CreateUserDTO";

export default class CreateUserValidation {
  static validate(dto: CreateUserDTO): UseCaseValidationResult {
    const emailOrError: Result<UserEmail> = UserEmail.create(dto.email);
    const firstNameOrError: Result<UserFirstName> = UserFirstName.create(
      dto.firstName
    );
    const lastNameOrError: Result<UserLastName> = UserLastName.create(
      dto.lastName
    );

    const validationResult = Result.combine([
      emailOrError,
      firstNameOrError,
      lastNameOrError,
    ]);

    return validationResult.isSuccess
      ? {
          isSuccess: true,
          error: null,
        }
      : {
          error: validationResult.error.toString(),
          isSuccess: false,
        };
  }
}
