import { UserDTO } from "@modules/users/dtos/userDTO";
import { AppError } from "@shared/core/AppError";
import { Either, Result } from "@shared/core/Result";
import { GetUserErrors } from "./GetUserErrors";

export type GetUserResponse = Either<
  | Result<UserDTO>
  | GetUserErrors.UserNotFound
  | AppError.UnexpectedError
  | Result<any>,
  Result<UserDTO>
>;
