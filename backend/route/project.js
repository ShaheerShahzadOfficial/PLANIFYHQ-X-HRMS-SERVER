import express from "express";

import {
  CREATE_PROJECT,
  GET_ALL_PROJECTS,
  UPDATE_PROJECT,
  DELETE_PROJECT,
} from "../controller/project.js";

import { auth } from "../middleware/auth.middleware.js";

const projectRouter = express.Router();

projectRouter.post("/create", auth, CREATE_PROJECT);
projectRouter.get("/all", auth, GET_ALL_PROJECTS);
projectRouter.put("/update/:id", auth, UPDATE_PROJECT);
projectRouter.delete("/delete/:id", auth, DELETE_PROJECT);
export default projectRouter;