import express from "express";
import {
  CREATE_DEPARTMENT,
  GET_DEPARTMENTS,
  UPDATE_DEPARTMENT,
  DELETE_DEPARTMENT,
  DEACTIVATE_DEPARTMENT,
} from "../controller/department.js";
import { auth } from "../middleware/auth.middleware.js";

const departmentRouter = express.Router();

departmentRouter.post("/create", auth, CREATE_DEPARTMENT);
departmentRouter.get("/get", auth, GET_DEPARTMENTS);
departmentRouter.put("/update/:id", auth, UPDATE_DEPARTMENT);
departmentRouter.delete("/delete/:id", auth, DELETE_DEPARTMENT);
departmentRouter.put("/deactivate/:id", auth, DEACTIVATE_DEPARTMENT);

export default departmentRouter;
