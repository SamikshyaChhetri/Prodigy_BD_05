import { Router } from "express";
import { registerController } from "./controller.js";
const registerRouter = Router();
registerRouter.post("/register", registerController);
export default registerRouter;
