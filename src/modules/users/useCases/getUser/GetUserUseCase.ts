import { Result, left, right } from "@shared/core/Result";
import { UserRepositoryInterface } from "@modules/users/repositories/interfaces/userRepository";
import { UseCase } from "@shared/core/UseCase";
import User from "@modules/users/domain/user";
import { UseCaseValidationResult } from "@shared/core/UseCaseValidationResult";
import { GetUserDto } from "./GetUserDto";
import { GetUserResponse } from "./GetUserResponse";
import GetUserValidation from "./GetUserValidation";
import { UserMap } from "@modules/users/mappers/userMap";
import { UserDTO } from "@modules/users/dtos/userDTO";

export class GetUserUseCase
  implements UseCase<GetUserDto, Promise<GetUserResponse>>
{
  private userRepository: UserRepositoryInterface;

  constructor(userRepository: UserRepositoryInterface) {
    this.userRepository = userRepository;
  }

  async execute(dto: GetUserDto): Promise<GetUserResponse> {
    const validationResult: UseCaseValidationResult =
      GetUserValidation.validate(dto);

    if (!validationResult.isSuccess) {
      return left(
        Result.fail<User>(validationResult.error.toString())
      ) as GetUserResponse;
    }

    return right(
      Result.ok<UserDTO>(
        UserMap.persistanceToDTO(
          await this.userRepository.getUserByUserId(dto.id)
        )
      )
    );
  }
}
