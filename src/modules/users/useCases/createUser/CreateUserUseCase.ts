import { CreateUserDTO } from "./CreateUserDTO";
import { CreateUserErrors } from "./CreateUserErrors";
import { Result, left, right } from "@shared/core/Result";
import { IUserRepository } from "@modules/users/repositories/interfaces/userRepository";
import { UseCase } from "@shared/core/UseCase";
import User from "@modules/users/domain/user";
import { UserMap } from "@modules/users/mappers/userMap";
import CreateUserValidation from "./CreateUserValidation";
import { UseCaseValidationResult } from "@shared/core/UseCaseValidationResult";
import { CreateUserResponse } from "./CreateUserResponse";

export class CreateUserUseCase
  implements UseCase<CreateUserDTO, Promise<CreateUserResponse>>
{
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(dto: CreateUserDTO): Promise<CreateUserResponse> {
    const validationResult: UseCaseValidationResult =
      CreateUserValidation.validate(dto);

    if (!validationResult.isSuccess) {
      return left(
        Result.fail<User>(validationResult.error.toString())
      ) as CreateUserResponse;
    }

    const user: User = UserMap.toDomain(dto);
    const userAlreadyExists: boolean = await this.userRepository.exists(
      user.email
    );

    if (userAlreadyExists) {
      return left(
        new CreateUserErrors.EmailAlreadyExistsError(user.email)
      ) as CreateUserResponse;
    }

    await this.userRepository.save(UserMap.toPersistence(user));

    return right(Result.ok<void>());
  }
}
