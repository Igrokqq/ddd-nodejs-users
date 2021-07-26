import { UserEmail } from "./userEmail";
import { UserId } from "./userId";
import { UserCreated } from "./events/userCreated";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UserFirstName } from "./userFirstName";
import { UserLastName } from "./userLastName";

interface UserProps {
  email: UserEmail;
  firstName: UserFirstName;
  lastName: UserLastName;
}

export default class User extends AggregateRoot<UserProps> {
  get userId(): UserId {
    return UserId.create(this._id).getValue();
  }

  get firstName(): string {
    return this.props.firstName.getValue();
  }

  get lastName(): string {
    return this.props.lastName.getValue();
  }

  get email(): string {
    return this.props.email.getValue();
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.email, argumentName: "email" },
      { argument: props.firstName, argumentName: "firstName" },
      { argument: props.lastName, argumentName: "lastName" },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message);
    }

    const isNewUser = !id;
    const user = new User(props, id);

    if (isNewUser) {
      user.addDomainEvent(new UserCreated(user));
    }

    return Result.ok<User>(user);
  }
}
