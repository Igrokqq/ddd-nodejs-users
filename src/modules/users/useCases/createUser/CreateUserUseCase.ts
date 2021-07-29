import { CreateUserDTO } from "./CreateUserDTO";
import { CreateUserErrors } from "./CreateUserErrors";
import { Result, left, right } from "@shared/core/Result";
import { UserRepositoryInterface } from "@modules/users/repositories/interfaces/userRepository";
import { UseCase } from "@shared/core/UseCase";
import User from "@modules/users/domain/user";
import { UserMap } from "@modules/users/mappers/userMap";
import CreateUserValidation from "./CreateUserValidation";
import { UseCaseValidationResult } from "@shared/core/UseCaseValidationResult";
import { CreateUserResponse } from "./CreateUserResponse";
import { ValidationError } from "@shared/core/ValidationError";

export class CreateUserUseCase
  implements UseCase<CreateUserDTO, Promise<CreateUserResponse>>
{
  private userRepository: UserRepositoryInterface;

  constructor(userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository;
  }

  async execute(dto: CreateUserDTO): Promise<CreateUserResponse> {
    const validationResult: UseCaseValidationResult =
      CreateUserValidation.validate(dto);

    if (!validationResult.isSuccess) {
      return left(
        new ValidationError(validationResult.error)
      ) as CreateUserResponse;
    }

    const user: User = UserMap.dtoToDomain(dto);
    const userAlreadyExists: boolean = await this.userRepository.exists(
      user.email.getValue()
    );

    if (userAlreadyExists) {
      return left(
        new CreateUserErrors.EmailAlreadyExistsError(user.email.getValue())
      ) as CreateUserResponse;
    }

    await this.userRepository.save(UserMap.domainToPersistance(user));

    return right(Result.ok<void>());
  }
}
