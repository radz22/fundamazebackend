import express from "express";
import {
  RecoveryAccount,
  SignUp,
  ResetPassword,
  SignIn,
} from "../controller/userControllers";
const userRoutes = express.Router();

userRoutes.post("/signup", SignUp);
userRoutes.post("/signin", SignIn);
userRoutes.post("/recoveryaccount", RecoveryAccount);
userRoutes.put("/reset/:id", ResetPassword);

export default userRoutes;
