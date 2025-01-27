import { Router } from "express";
import { createOEM, getOEMs, updateOEM, deleteOEM } from "../controller/oem.js";
import { auth } from "../middleware/auth.middleware.js";

const oemRouter = Router();

oemRouter.post("/create", auth, createOEM);
oemRouter.get("/get", auth, getOEMs);
oemRouter.put("/update/:id", auth, updateOEM);
oemRouter.delete("/delete/:id", auth, deleteOEM);

export default oemRouter;
