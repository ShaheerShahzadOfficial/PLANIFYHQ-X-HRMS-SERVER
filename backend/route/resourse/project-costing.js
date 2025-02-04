import express from "express";
import {
  createProjectCosting,
  listProjectCostings,
  updateProjectCosting,
  deleteProjectCosting,
  getProjectCostingById,
} from "../../controller/resourse/project-costing.js";
import { auth } from "../../middleware/auth.middleware.js";

const projectCostingRouter = express.Router();

projectCostingRouter.post("/", auth, createProjectCosting);
projectCostingRouter.get("/", auth, listProjectCostings);
projectCostingRouter.put("/:id", auth, updateProjectCosting);
projectCostingRouter.delete("/:id", auth, deleteProjectCosting);
projectCostingRouter.get("/:id", auth, getProjectCostingById);

export default projectCostingRouter;
