import express from "express";
import { ADD_BANK_DETAILS, UPDATE_BANK_DETAILS } from "../controller/bank-account.js";

const bankDetailsRouter = express.Router();

bankDetailsRouter.post("/add", ADD_BANK_DETAILS);
bankDetailsRouter.put("/update", UPDATE_BANK_DETAILS);

export default bankDetailsRouter;
