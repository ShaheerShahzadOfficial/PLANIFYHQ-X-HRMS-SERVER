import {
  GET_SHIFT_SCHEDULING,
  CREATE_SHIFT_SCHEDULING,
  DELETE_SHIFT_SCHEDULING,
  UPDATE_SHIFT_SCHEDULING,
} from "../controller/shift-scheduling.js";
import express from "express";
import { auth } from "../middleware/auth.middleware.js";
const shiftSchedulingRouter = express.Router();

shiftSchedulingRouter.get("/", auth, GET_SHIFT_SCHEDULING);
shiftSchedulingRouter.post("/", auth, CREATE_SHIFT_SCHEDULING);
shiftSchedulingRouter.delete("/:id", auth, DELETE_SHIFT_SCHEDULING);
shiftSchedulingRouter.put("/:id", auth, UPDATE_SHIFT_SCHEDULING);

export default shiftSchedulingRouter;
