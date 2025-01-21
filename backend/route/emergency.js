import express from "express";
import { ADD_EMERGENCY_DETAILS,UPDATE_EMERGENCY_DETAILS } from "../controller/emergency-details.js";

const emergencyRouter = express.Router();

emergencyRouter.post("/add", ADD_EMERGENCY_DETAILS);
emergencyRouter.put("/update", UPDATE_EMERGENCY_DETAILS);

export default emergencyRouter;
