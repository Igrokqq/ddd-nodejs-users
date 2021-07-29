import { Mapper } from "@shared/infra/Mapper";
import User from "../domain/user";
import { UserDTO } from "../dtos/userDTO";
import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { UserEmail } from "../domain/userEmail";
import { Result } from "@shared/core/Result";
import { UserFirstName } from "../domain/userFirstName";
import { UserLastName } from "../domain/userLastName";
import { UserEntity } from "@shared/infra/database/typeorm/entity/userEntity";
import { TextUtils } from "@shared/utils/TextUtils";

export interface UserMapPersistanceInterface {
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
}

export class UserMap implements Mapper<User> {
  static domainToDTO(user: User): UserDTO {
    return {
      id: TextUtils.toNumber(user.id.toValue()),
      firstName: user.firstName.getValue(),
      lastName: user.lastName.getValue(),
      email: user.email.getValue(),
    };
  }

  static persistanceToDTO(entity: UserEntity): UserDTO {
    if (!entity) {
      return null;
    }
    return {
      id: entity.id,
      firstName: entity.first_name,
      lastName: entity.last_name,
      email: entity.email,
    };
  }

  static persistanceToDomain(entity: UserEntity): User | null {
    if (!entity) {
      return null;
    }

    const firstNameOrError: Result<UserFirstName> = UserFirstName.create(
      entity.first_name
    );
    const lastNameOrError: Result<UserLastName> = UserLastName.create(
      entity.last_name
    );
    const emailOrError: Result<UserEmail> = UserEmail.create(entity.email);
    const userOrError = User.create(
      {
        firstName: firstNameOrError.getValue(),
        lastName: lastNameOrError.getValue(),
        email: emailOrError.getValue(),
      },
      entity.id ? new UniqueEntityID(entity.id) : null
    );

    if (userOrError.isFailure) {
      console.error(userOrError.error);
    }

    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  static dtoToDomain(raw: UserDTO): User {
    const firstNameOrError: Result<UserFirstName> = UserFirstName.create(
      raw.firstName
    );
    const lastNameOrError: Result<UserLastName> = UserLastName.create(
      raw.lastName
    );
    const emailOrError: Result<UserEmail> = UserEmail.create(raw.email);
    const userOrError: Result<User> = User.create(
      {
        firstName: firstNameOrError.getValue(),
        lastName: lastNameOrError.getValue(),
        email: emailOrError.getValue(),
      },
      raw.id ? new UniqueEntityID(raw.id) : null
    );

    if (userOrError.isFailure) {
      console.error(userOrError.error);
    }

    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  static domainToPersistance(user: User): UserMapPersistanceInterface {
    // let password: string = null;
    // if (!!user.password === true) {
    //   if (user.password.isAlreadyHashed()) {
    //     password = user.password.value;
    //   } else {
    //     password = await user.password.getHashedValue();
    //   }
    // }

    return {
      first_name: user.firstName.getValue(),
      last_name: user.lastName.getValue(),
      email: user.email.getValue(),
    };
  }
}
