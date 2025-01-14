import express from "express";
import {
  CREATE_DESIGNATION,
  GET_DESIGNATIONS,
  UPDATE_DESIGNATION,
  DELETE_DESIGNATION,
  DEACTIVATE_DESIGNATION,
} from "../controller/designation.js";
import { auth } from "../middleware/auth.middleware.js";

const designationRouter = express.Router();

designationRouter.post("/create", auth, CREATE_DESIGNATION);
designationRouter.get("/get", auth, GET_DESIGNATIONS);
designationRouter.put("/update/:id", auth, UPDATE_DESIGNATION);
designationRouter.delete("/delete/:id", auth, DELETE_DESIGNATION);
designationRouter.put("/deactivate/:id", auth, DEACTIVATE_DESIGNATION);

export default designationRouter;

