import express from "express";
import { createPlan, deletePlan, getPlans, updatePlan } from "../controller/plan.js";
import { auth } from "../middleware/auth.middleware.js";
import { role } from "../middleware/role.middleware.js";
const planRouter = express.Router();

planRouter.post("/create", createPlan);
planRouter.get("/get", getPlans);
planRouter.put("/update/:id", updatePlan);
planRouter.delete("/delete/:id", deletePlan);
export default planRouter;
