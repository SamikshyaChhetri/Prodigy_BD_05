import { Router } from "express";
import { isUser } from "../../middlewares/isUser.js";
import { singleUserController, userController } from "./controller.js";
const userRouter = Router();
userRouter.get("/getUser", isUser, userController);
userRouter.get("/getSingleuser/:id", isUser, singleUserController);
export default userRouter;
