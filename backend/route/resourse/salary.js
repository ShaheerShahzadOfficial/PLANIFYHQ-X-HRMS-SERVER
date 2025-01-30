import express from "express";
import {
  CREATE_SALARY,
  GET_SALARY,
  GET_SALARY_BY_ID,
  UPDATE_SALARY,
  DELETE_SALARY,
} from "../../controller/resourse/salary.js";
import { auth } from "../../middleware/auth.middleware.js";
const resourseSalaryRouter = express.Router();

resourseSalaryRouter.post("/create", auth, CREATE_SALARY);
resourseSalaryRouter.get("/get", auth, GET_SALARY);
resourseSalaryRouter.get("/get/:id", auth, GET_SALARY_BY_ID);
resourseSalaryRouter.put("/update/:id", auth, UPDATE_SALARY);
resourseSalaryRouter.delete("/delete/:id", auth, DELETE_SALARY);

export default resourseSalaryRouter;
