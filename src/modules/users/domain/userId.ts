import { UniqueEntityID } from "@shared/domain/UniqueEntityID";
import { Result } from "@shared/core/Result";
import { Entity } from "@shared/domain/Entity";

export class UserId extends Entity<any> {
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
    if (id && Number.isNaN(id.toValue())) {
      return Result.fail<UserId>(`Incorrect UserId ${id}`);
    }
    return Result.ok<UserId>(new UserId(id));
  }
}
