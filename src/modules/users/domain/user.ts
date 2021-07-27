import { UserEmail } from "./userEmail";
import { UserId } from "./userId";
import { UserCreated } from "./events/userCreated";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UserFirstName } from "./userFirstName";
import { UserLastName } from "./userLastName";
import { JwtAccessToken, JwtRefreshToken } from "./jwt";
import { UserLoggedIn } from "./events/userLoggedIn";

interface UserProps {
  readonly email: UserEmail;
  readonly firstName: UserFirstName;
  readonly lastName: UserLastName;
  accessToken?: JwtAccessToken;
  refreshToken?: JwtRefreshToken;
}

export default class User extends AggregateRoot<UserProps> {
  get userId(): UserId {
    return UserId.create(this._id).getValue();
  }

  get firstName(): UserFirstName {
    return this.props.firstName;
  }

  get lastName(): UserLastName {
    return this.props.lastName;
  }

  get email(): UserEmail {
    return this.props.email;
  }

  get accessToken(): string {
    return this.props.accessToken;
  }

  get refreshToken(): string {
    return this.props.refreshToken;
  }

  public isLoggedIn(): boolean {
    return !!this.props.accessToken && !!this.props.refreshToken;
  }

  public setJwtTokens(
    accessToken: JwtAccessToken,
    refreshToken: JwtRefreshToken
  ): void {
    this.addDomainEvent(new UserLoggedIn(this));
    this.props.accessToken = accessToken;
    this.props.refreshToken = refreshToken;
    // this.props.lastLogin = new Date();
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
