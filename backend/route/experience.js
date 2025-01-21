import express from "express";
import { ADD_EXPERIENCE_DETAILS, UPDATE_EXPERIENCE_DETAILS } from "../controller/experience.js";

const experienceRouter = express.Router();

experienceRouter.post("/add", ADD_EXPERIENCE_DETAILS);
experienceRouter.put("/update", UPDATE_EXPERIENCE_DETAILS);

export default experienceRouter;
