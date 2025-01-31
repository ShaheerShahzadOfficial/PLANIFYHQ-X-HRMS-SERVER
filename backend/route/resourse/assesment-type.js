import express from "express";
import { createAssesmentType, deleteAssesmentType, getAssesmentType, updateAssesmentType } from "../../controller/resourse/assesment-type.js";
import { auth } from "../../middleware/auth.middleware.js";
const assesmentTypeRouter = express.Router();

assesmentTypeRouter.post("/create", auth, createAssesmentType);
assesmentTypeRouter.get("/get", auth, getAssesmentType);
assesmentTypeRouter.put("/update/:id", auth, updateAssesmentType);
assesmentTypeRouter.delete("/delete/:id", auth, deleteAssesmentType);
export default assesmentTypeRouter;
