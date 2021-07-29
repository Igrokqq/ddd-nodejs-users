import { UserMapPersistanceInterface } from "@modules/users/mappers/userMap";
import { UserEntity } from "@shared/infra/database/typeorm/entity/userEntity";

export interface UserRepositoryInterface {
  exists(userEmail: string): Promise<boolean>;
  getUserByUserId(userId: number): Promise<UserEntity>;
  getUserByEmail(email: string): Promise<UserEntity>;
  save(user: UserMapPersistanceInterface): Promise<void>;
}
