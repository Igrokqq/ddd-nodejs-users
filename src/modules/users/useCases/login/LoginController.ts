import express from "express";
import { BaseController } from "@shared/infra/http/models/BaseController";
import LoginUseCase from "./LoginUseCase";
import { LoginRequestDto, LoginResponseDto } from "./LoginDto";
import { LoginResponse } from "./LoginResponse";
import { LoginErrors } from "./LoginErrors";

export default class LoginController extends BaseController {
  constructor(private readonly useCase: LoginUseCase) {
    super();
  }

  async executeImplementation(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    const dto: LoginRequestDto = {
      email: req.body.email,
    };

    try {
      const result: LoginResponse = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case LoginErrors.UserIncorrectEmail:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue().message);
        }
      }

      return this.ok<LoginResponseDto>(
        res,
        (result as LoginResponse).value.getValue()
      );
    } catch (error) {
      this.fail(res, error);
    }
  }
}
