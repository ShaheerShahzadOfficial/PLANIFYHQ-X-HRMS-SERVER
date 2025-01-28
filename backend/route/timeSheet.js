import express from "express";
import {
  createTimesheet,
  getTimesheets,
  updateTimesheet,
  deleteTimesheet,
} from "../controller/timesheet.js";
import { auth } from "../middleware/auth.middleware.js";

const timeSheetRouter = express.Router();

timeSheetRouter.post("/create", auth, createTimesheet);
timeSheetRouter.get("/get", auth,  getTimesheets);
timeSheetRouter.put("/update/:id", auth, updateTimesheet);
timeSheetRouter.delete("/delete/:id", auth, deleteTimesheet);

export default timeSheetRouter;
