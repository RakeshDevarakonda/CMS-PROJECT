import express from "express";
import {
  checkUserLoginController,
  logoutController,
  signinController,
  signupController,
} from "../../controllers/auth/auth-controller.js";
import { verifyjwtToken } from "../../middlewares/verifyjwtToken.js";
import { rateLimiter } from "../../index.js";



const authRouter = express.Router();

authRouter.get("/checklogin", verifyjwtToken, checkUserLoginController);

authRouter.post("/signup", signupController);
authRouter.post("/signin",rateLimiter, signinController);

authRouter.post("/logout", logoutController);

export default authRouter;
