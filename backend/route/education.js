import express from "express";
import { ADD_EDUCATION_DETAILS, UPDATE_EDUCATION_DETAILS } from "../controller/education-details.js";

const educationRouter = express.Router();

educationRouter.post("/add", ADD_EDUCATION_DETAILS);
educationRouter.put("/update", UPDATE_EDUCATION_DETAILS);

export default educationRouter;
