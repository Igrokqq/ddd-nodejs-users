import { UserId } from "@modules/users/domain/userId";
import { Result } from "@shared/core/Result";
import { UseCaseValidationResult } from "@shared/core/UseCaseValidationResult";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { GetUserDto } from "./GetUserDto";

export default class GetUserValidation {
  static validate(dto: GetUserDto): UseCaseValidationResult {
    const validationResult = Result.combine([
      UserId.create(new UniqueEntityID(dto.id)),
    ]);

    return validationResult.isSuccess
      ? {
          isSuccess: true,
          error: null,
        }
      : {
          error: validationResult.error,
          isSuccess: false,
        };
  }
}
