import express from "express";
import { BaseController } from "@shared/infra/http/models/BaseController";
import { GetUserDto } from "./GetUserDto";
import { TextUtils } from "@shared/utils/TextUtils";
import { GetUserResponse } from "./GetUserResponse";
import { GetUserErrors } from "./GetUserErrors";
import { GetUserUseCase } from "./GetUserUseCase";
import { ValidationError } from "@shared/core/ValidationError";

export class GetUserController extends BaseController {
  private _useCase: GetUserUseCase;

  constructor(useCase: GetUserUseCase) {
    super();
    this._useCase = useCase;
  }

  async executeImplementation(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const dto: GetUserDto = {
      id: TextUtils.toNumber(req.params.id),
    };
    try {
      const result: GetUserResponse = await this._useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        console.error("error constrctor", error);
        switch (error.constructor) {
          case GetUserErrors.UserNotFound:
            return this.notFound(res, error.errorValue().message);
          case ValidationError:
            return this.validationFailed(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue().message);
        }
      }

      return this.ok(res, (result as GetUserResponse).value.getValue());
    } catch (error) {
      return this.fail(res, error);
    }
  }
}
