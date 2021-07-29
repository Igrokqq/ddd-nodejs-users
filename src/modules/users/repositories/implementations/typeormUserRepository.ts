import { Repository, EntityTarget, Connection } from "typeorm";
import TypeormBaseRepository from "@shared/infra/database/typeorm/typeormBaseRepository";
import { UserRepositoryInterface } from "../interfaces/userRepository";
import { UserMapPersistanceInterface } from "@modules/users/mappers/userMap";
import { UserEntity } from "@shared/infra/database/typeorm/entity/userEntity";

export default class TypeormUserRepository
  extends TypeormBaseRepository
  implements UserRepositoryInterface
{
  private userRepository: Repository<UserEntity>;

  constructor(userEntity: EntityTarget<UserEntity>) {
    super();
    this.getConnection().then((connection: Connection) => {
      this.userRepository = connection.getRepository(userEntity);
    });
  }

  async exists(email: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    return !!user;
  }

  async save(user: UserMapPersistanceInterface): Promise<void> {
    await this.userRepository.save(user);
  }

  getUserByUserId(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }
  getUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
