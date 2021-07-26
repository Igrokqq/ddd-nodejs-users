import { UseCase } from "../UseCase";
import { left } from "@shared/core/Result";
import { AppError } from "@shared/core/AppError";

type Response = unknown;

export default class UseCaseWrapFactory {
  wrap(useCase: UseCase<any, any>): any {
    const execute = useCase.execute.bind(useCase);

    useCase.execute = function <Dto>(dto: Dto) {
      try {
        return execute(dto);
      } catch (error) {
        return left(new AppError.UnexpectedError(error)) as Response;
      }
    };

    return useCase;
  }
}
