import express from "express";
import { getDashboardStats, getEmployeeDashboardStats } from "../../controller/dashboard/index.js";
import { auth } from "../../middleware/auth.middleware.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/stats", auth, getDashboardStats);
dashboardRouter.get("/employee-stats", auth, getEmployeeDashboardStats);

export default dashboardRouter;
