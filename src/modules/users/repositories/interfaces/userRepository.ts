import { IUserMapPersistence } from "@modules/users/mappers/userMap";
import { UserEntity } from "@shared/infra/database/typeorm/entity/userEntity";

export interface IUserRepository {
  exists(userEmail: string): Promise<boolean>;
  getUserByUserId(userId: number): Promise<UserEntity>;
  // getUserByUserId(userId: string): Promise<User>;
  // getUserByUserName(userName: UserName | string): Promise<User>;
  // save(user: User): Promise<void>;
  save(user: IUserMapPersistence): Promise<void>;
}
