import { Result } from "@shared/core/Result";
import { ValueObject } from "@shared/domain/ValueObject";
import { Guard } from "@shared/core/Guard";

interface UserFirstNameProps {
  readonly firstName: string;
}

export class UserFirstName extends ValueObject<UserFirstNameProps> {
  public static maxLength = 24;
  public static minLength = 2;

  get value(): string {
    return this.props.firstName;
  }

  public getValue(): string {
    return this.props.firstName;
  }

  private constructor(props: UserFirstNameProps) {
    super(props);
  }

  public static create(firstName: string): Result<UserFirstName> {
    const firstNameResult = Guard.againstNullOrUndefined(
      firstName,
      "firstName"
    );
    if (!firstNameResult.succeeded) {
      return Result.fail<UserFirstName>(firstNameResult.message);
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, firstName);
    if (!minLengthResult.succeeded) {
      return Result.fail<UserFirstName>(minLengthResult.message);
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, firstName);
    if (!maxLengthResult.succeeded) {
      return Result.fail<UserFirstName>(minLengthResult.message);
    }

    return Result.ok<UserFirstName>(new UserFirstName({ firstName }));
  }
}
