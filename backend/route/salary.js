import { auth } from "../middleware/auth.middleware.js";
import {
  GET_SALARIES,
  CREATE_SALARY,
  UPDATE_SALARY,
  DELETE_SALARY,
} from "../controller/salary.js";
import express from "express";

const salaryRouter = express.Router();

salaryRouter.get("/", auth, GET_SALARIES);
salaryRouter.post("/", auth, CREATE_SALARY);
salaryRouter.put("/:id", auth, UPDATE_SALARY);
salaryRouter.delete("/:id", auth, DELETE_SALARY);

export default salaryRouter;
