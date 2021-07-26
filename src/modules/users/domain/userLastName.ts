import { Result } from "@shared/core/Result";
import { ValueObject } from "@shared/domain/ValueObject";
import { Guard } from "@shared/core/Guard";

interface UserLastNameProps {
  readonly lastName: string;
}

export class UserLastName extends ValueObject<UserLastNameProps> {
  public static maxLength = 24;
  public static minLength = 2;

  get value(): string {
    return this.props.lastName;
  }

  public getValue(): string {
    return this.props.lastName;
  }

  private constructor(props: UserLastNameProps) {
    super(props);
  }

  public static create(lastName: string): Result<UserLastName> {
    const firstNameResult = Guard.againstNullOrUndefined(lastName, "lastName");
    if (!firstNameResult.succeeded) {
      return Result.fail<UserLastName>(firstNameResult.message);
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, lastName);
    if (!minLengthResult.succeeded) {
      return Result.fail<UserLastName>(minLengthResult.message);
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, lastName);
    if (!maxLengthResult.succeeded) {
      return Result.fail<UserLastName>(minLengthResult.message);
    }

    return Result.ok<UserLastName>(new UserLastName({ lastName }));
  }
}
