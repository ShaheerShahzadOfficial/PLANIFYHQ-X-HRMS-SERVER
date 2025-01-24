import {
  GET_LEAVE_TYPES,
  UPDATE_LEAVE_TYPE,
  DELETE_LEAVE_TYPE,
  CREATE_LEAVE_TYPE,
  GET_LEAVES,
  GET_MY_LEAVES,
  CREATE_LEAVE,
  UPDATE_LEAVE,
  DELETE_LEAVE,
  UPDATE_LEAVE_STATUS,
} from "../controller/leave.js";

import express from "express";

import { auth } from "../middleware/auth.middleware.js";

const LeaveRouter = express.Router();

LeaveRouter.get("/types", auth, GET_LEAVE_TYPES);

LeaveRouter.post("/types", auth, CREATE_LEAVE_TYPE);

LeaveRouter.put("/types/:id", auth, UPDATE_LEAVE_TYPE);

LeaveRouter.delete("/types/:id", auth, DELETE_LEAVE_TYPE);

LeaveRouter.get("/", auth, GET_LEAVES);

LeaveRouter.get("/my", auth, GET_MY_LEAVES);

LeaveRouter.post("/", auth, CREATE_LEAVE);

LeaveRouter.put("/:id", auth, UPDATE_LEAVE);

LeaveRouter.delete("/:id", auth, DELETE_LEAVE);

LeaveRouter.put("/:id/update-status", auth, UPDATE_LEAVE_STATUS);

export default LeaveRouter;
