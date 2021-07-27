import { typeormUserRepository } from "@modules/users/repositories";
import { authService } from "@modules/users/services";
import UseCaseWrapFactory from "@shared/core/factories/UseCaseWrapFactory";
import LoginController from "./LoginController";
import LoginUseCase from "./LoginUseCase";

export const loginUseCase: LoginUseCase = new UseCaseWrapFactory().wrap(
  new LoginUseCase(typeormUserRepository, authService)
);
export const loginController: LoginController = new LoginController(
  loginUseCase
);
