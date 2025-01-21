import express from "express";
import {
  ADD_PERSONAL_INFO,
  UPDATE_PERSONAL_INFO,
} from "../controller/personal-information.js";

const personalInfoRouter = express.Router();

personalInfoRouter.post("/add", ADD_PERSONAL_INFO);
personalInfoRouter.put("/update", UPDATE_PERSONAL_INFO);

export default personalInfoRouter;
