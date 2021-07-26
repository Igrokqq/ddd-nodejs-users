import * as express from "express";
import { createUserController } from "@modules/users/useCases/createUser";
import { getUserController } from "@modules/users/useCases/getUser";

const userRouter = express.Router();

userRouter.post("/", (req: express.Request, res: express.Response) =>
  createUserController.execute(req, res)
);
userRouter.get("/", (req, res) => {
  return res.json({ message: "Test" });
});
userRouter.get("/:id", (req: express.Request, res: express.Response) => {
  getUserController.execute(req, res);
});

export { userRouter };
