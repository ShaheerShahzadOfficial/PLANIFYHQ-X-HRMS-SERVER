import express from "express";
import { CREATE_EMPLOYEE, createUser, GET_COMPANIES, GET_EMPLOYEES, loginUser } from "../controller/user.js";
import { auth } from "../middleware/auth.middleware.js";
const userRouter = express.Router();

userRouter.post("/create", auth, createUser);
userRouter.post("/login", loginUser);
userRouter.post("/create-employee", auth, CREATE_EMPLOYEE);
userRouter.get("/get-employees", auth, GET_EMPLOYEES);
userRouter.get("/get-companies", auth, GET_COMPANIES);
export default userRouter;
