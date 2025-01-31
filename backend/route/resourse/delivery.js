import express from "express";
import { createDelivery, deleteDelivery, getDelivery, updateDelivery } from "../../controller/resourse/delivery.js";
import { auth } from "../../middleware/auth.middleware.js";
const deliveryRouter = express.Router();

deliveryRouter.post("/create", auth, createDelivery);
deliveryRouter.get("/get", auth, getDelivery);
deliveryRouter.put("/update/:id", auth, updateDelivery);
deliveryRouter.delete("/delete/:id", auth, deleteDelivery);
export default deliveryRouter;
