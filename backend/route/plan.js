import express from "express";
import { createPlan, getPlans } from "../controller/plan.js";
import { auth } from "../middleware/auth.middleware.js";
import { role } from "../middleware/role.middleware.js";
const planRouter = express.Router();

planRouter.post("/create", auth, role, createPlan);
planRouter.get("/get", getPlans);
export default planRouter;
