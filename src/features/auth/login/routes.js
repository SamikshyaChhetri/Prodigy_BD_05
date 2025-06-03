import { Router } from "express";
import {
  loginController,
  logoutController,
  resetPasswordController,
} from "./controller.js";

const loginrouter = Router();
loginrouter.post("/login", loginController);
loginrouter.post("/logout", logoutController);
loginrouter.post("/reset", resetPasswordController);
export default loginrouter;
