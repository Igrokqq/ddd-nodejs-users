import * as express from "express";
import { createUserController } from "@modules/users/useCases/createUser";
import { getUserController } from "@modules/users/useCases/getUser";
import { loginController } from "@modules/users/useCases/login";
import { middleware } from "@shared/infra/http";

const userRouter = express.Router();

userRouter.post("/", (req: express.Request, res: express.Response) =>
  createUserController.execute(req, res)
);
userRouter.get(
  "/",
  middleware.ensureAuthenticated(),
  (req: express.Request, res: express.Response) => {
    res.status(200).send("TEST");
  }
);
userRouter.get("/:id", (req: express.Request, res: express.Response) => {
  getUserController.execute(req, res);
});
userRouter.post("/sign-in", (req: express.Request, res: express.Response) => {
  loginController.execute(req, res);
});
export { userRouter };
