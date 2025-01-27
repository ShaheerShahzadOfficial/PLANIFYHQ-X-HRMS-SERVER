import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { createActivity, getActivities, updateActivity, deleteActivity } from "../controller/activity.js";

const activityRouter = express.Router();

activityRouter.post("/create", auth, createActivity);
activityRouter.get("/get", auth, getActivities);
activityRouter.put("/update/:id", auth, updateActivity);
activityRouter.delete("/delete/:id", auth, deleteActivity);

export default activityRouter;