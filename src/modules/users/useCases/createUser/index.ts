import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserController } from "./CreateUserController";
import { typeormUserRepository } from "../../repositories";
import UseCaseWrapFactory from "@shared/core/factories/UseCaseWrapFactory";

export const createUserUseCase: CreateUserUseCase =
  new UseCaseWrapFactory().wrap(new CreateUserUseCase(typeormUserRepository));
export const createUserController = new CreateUserController(createUserUseCase);
