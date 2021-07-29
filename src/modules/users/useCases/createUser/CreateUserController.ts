import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserDTO } from "./CreateUserDTO";
import { CreateUserErrors } from "./CreateUserErrors";
import { BaseController } from "@shared/infra/http/models/BaseController";
import { TextUtils } from "@shared/utils/TextUtils";
import { DecodedExpressRequest } from "@modules/users/infra/http/models/decodedRequest";
import * as express from "express";
import { CreateUserResponse } from "./CreateUserResponse";
import { ValidationError } from "@shared/core/ValidationError";

export class CreateUserController extends BaseController {
  private _useCase: CreateUserUseCase;

  constructor(useCase: CreateUserUseCase) {
    super();
    this._useCase = useCase;
  }

  async executeImplementation(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<express.Response> {
    const dto: CreateUserDTO = {
      firstName: TextUtils.sanitize(req.body.firstName),
      lastName: TextUtils.sanitize(req.body.lastName),
      email: TextUtils.sanitize(req.body.email),
    };

    try {
      const result: CreateUserResponse = await this._useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateUserErrors.EmailAlreadyExistsError:
            return this.conflict(res, error.errorValue().message);
          case ValidationError:
            return this.validationFailed(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue().message);
        }
      } else {
        return this.ok(res);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
