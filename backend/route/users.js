import express from "express";
import { createUser, loginUser } from "../controller/user.js";
import { auth } from "../middleware/auth.middleware.js";
import { role } from "../middleware/role.middleware.js";
const userRouter = express.Router();

userRouter.post("/create", auth, createUser);
userRouter.post("/login", loginUser);
export default userRouter;
