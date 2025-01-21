import {
  CHECKIN,
  CHECKOUT,
  GET_ALL_ATTENDANCE,
  GET_ATTENDANCE_REPORT,
  GET_MY_ATTENDANCE,
} from "../controller/attendence.js";
import express from "express";
import { auth } from "../middleware/auth.middleware.js";
const attendanceRouter = express.Router();

attendanceRouter.post("/checkin", auth, CHECKIN);
attendanceRouter.post("/checkout", auth, CHECKOUT);
attendanceRouter.get("/all", auth, GET_ALL_ATTENDANCE);
attendanceRouter.get("/report", auth, GET_ATTENDANCE_REPORT);
attendanceRouter.get("/employee", auth, GET_MY_ATTENDANCE);

export default attendanceRouter;
