import express from "express";
import { CREATE_EMPLOYEE, createUser, GET_COMPANIES, GET_EMPLOYEES, loginUser, UPDATE_COMPANY, UPDATE_EMPLOYEE, DELETE_COMPANY, DELETE_EMPLOYEE, DISABLE_COMPANY_EMPLOYEES_ACCOUNT, GET_EMPLOYEE_BY_ID, GET_MY_PROFILE } from "../controller/user.js";
import { auth } from "../middleware/auth.middleware.js";
const userRouter = express.Router();

userRouter.post("/create", auth, createUser);
userRouter.post("/login", loginUser);
userRouter.post("/create-employee", auth, CREATE_EMPLOYEE);
userRouter.get("/get-employees", auth, GET_EMPLOYEES);
userRouter.get("/get-companies", auth, GET_COMPANIES);
userRouter.put("/update-employee/:id", auth, UPDATE_EMPLOYEE);
userRouter.delete("/delete-employee/:id", auth, DELETE_EMPLOYEE);
userRouter.put("/update-company/:id", auth, UPDATE_COMPANY);
userRouter.delete("/delete-company/:id", auth, DELETE_COMPANY);
userRouter.put("/disable-company-employees/:id", auth, DISABLE_COMPANY_EMPLOYEES_ACCOUNT);
userRouter.get("/get-employee-by-id/:id", auth, GET_EMPLOYEE_BY_ID);
userRouter.get("/get-my-profile", auth, GET_MY_PROFILE);

export default userRouter;
