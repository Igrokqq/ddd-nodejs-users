import { typeormUserRepository } from "@modules/users/repositories";
import UseCaseWrapFactory from "@shared/core/factories/UseCaseWrapFactory";
import { GetUserController } from "./GetUserController";
import { GetUserUseCase } from "./GetUserUseCase";

export const getUserUseCase: GetUserUseCase = new UseCaseWrapFactory().wrap(
  new GetUserUseCase(typeormUserRepository)
);
export const getUserController: GetUserController = new GetUserController(
  getUserUseCase
);
