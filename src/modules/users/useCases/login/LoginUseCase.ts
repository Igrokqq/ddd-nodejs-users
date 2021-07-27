import { JwtAccessToken, JwtRefreshToken } from "@modules/users/domain/jwt";
import User from "@modules/users/domain/user";
import { UserMap } from "@modules/users/mappers/userMap";
import { UserRepositoryInterface } from "@modules/users/repositories/interfaces/userRepository";
import { AuthServiceInterface } from "@modules/users/services/authService";
import { left, Result, right } from "@shared/core/Result";
import { UseCase } from "@shared/core/UseCase";
import { UseCaseValidationResult } from "@shared/core/UseCaseValidationResult";
import { TextUtils } from "@shared/utils/TextUtils";
import { LoginRequestDto, LoginResponseDto } from "./LoginDto";
import { LoginErrors } from "./LoginErrors";
import { LoginResponse } from "./LoginResponse";
import LoginValidation from "./LoginValidation";

export default class LoginUseCase
  implements UseCase<LoginRequestDto, Promise<LoginResponse>>
{
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly authService: AuthServiceInterface
  ) {}

  async execute(dto: LoginRequestDto): Promise<LoginResponse> {
    const validationResult: UseCaseValidationResult =
      LoginValidation.validate(dto);

    if (!validationResult.isSuccess) {
      return left(Result.fail<User>(validationResult.error.toString()));
    }

    const user: User | null = UserMap.persistanceToDomain(
      await this.userRepository.getUserByEmail(dto.email)
    );

    if (!user) {
      return left(new LoginErrors.UserIncorrectEmail(dto.email));
    }

    const accessToken: JwtAccessToken = this.authService.signJWT({
      userId: TextUtils.toNumber(user.userId.getValue().toValue()),
      email: user.email.getValue(),
    });
    const refreshToken: JwtRefreshToken = this.authService.createRefreshToken();

    user.setJwtTokens(accessToken, refreshToken);

    await this.authService.saveAuthenticatedUser(user);

    return right(
      Result.ok<LoginResponseDto>({
        accessToken,
        refreshToken,
      })
    );
  }
}
