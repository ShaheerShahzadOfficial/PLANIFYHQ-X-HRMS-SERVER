import { auth } from "../middleware/auth.middleware.js";
import {
  GET_SALARIES,
  CREATE_SALARY,
  UPDATE_SALARY,
  DELETE_SALARY,
  GET_SALARY_BY_ID,
} from "../controller/salary.js";
import express from "express";

const salaryRouter = express.Router();

salaryRouter.get("/", auth, GET_SALARIES);
salaryRouter.get("/:id", auth, GET_SALARY_BY_ID);
salaryRouter.post("/", auth, CREATE_SALARY);
salaryRouter.put("/:id", auth, UPDATE_SALARY);
salaryRouter.delete("/:id", auth, DELETE_SALARY);

export default salaryRouter;
