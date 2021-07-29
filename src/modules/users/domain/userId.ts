import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { Result } from "@shared/core/Result";
import { Entity } from "@shared/domain/Entity";

export class UserId extends Entity<UserId> {
  get id(): UniqueEntityID {
    return this._id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  getValue(): UniqueEntityID {
    return this._id;
  }

  public static create(id?: UniqueEntityID): Result<UserId> {
    const idValue: unknown = id.toValue();

    if (id && (typeof idValue !== "number" || Number.isNaN(idValue))) {
      return Result.fail<UserId>("UserId must be number");
    }
    return Result.ok<UserId>(new UserId(id));
  }
}
