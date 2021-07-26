import { UserEntity } from "@shared/infra/database/typeorm/entity/userEntity";
import TypeormUserRepository from "./implementations/typeormUserRepository";

export const typeormUserRepository = new TypeormUserRepository(UserEntity);
