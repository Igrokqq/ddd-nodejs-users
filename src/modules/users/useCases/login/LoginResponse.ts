import { AppError } from "@shared/core/AppError";
import { Either, Result } from "@shared/core/Result";
import { LoginResponseDto } from "./LoginDto";
import { LoginErrors } from "./LoginErrors";

export type LoginResponse = Either<
  LoginErrors.UserIncorrectEmail | AppError.UnexpectedError | Result<any>,
  Result<LoginResponseDto>
>;
