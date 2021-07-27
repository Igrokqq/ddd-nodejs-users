import { UserEmail } from "@modules/users/domain/userEmail";
import { Result } from "@shared/core/Result";
import { UseCaseValidationResult } from "@shared/core/UseCaseValidationResult";
import { LoginRequestDto } from "./LoginDto";

export default class CreateUserValidation {
  static validate(dto: LoginRequestDto): UseCaseValidationResult {
    const validationResult = Result.combine([UserEmail.create(dto.email)]);

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
