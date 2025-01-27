import { Router } from "express";
import { createClient, getClients, updateClient, deleteClient } from "../controller/client.js";
import { auth } from "../middleware/auth.middleware.js";

const clientRouter = Router();

clientRouter.post("/create", auth, createClient);
clientRouter.get("/get", auth, getClients);
clientRouter.put("/update/:id", auth, updateClient);
clientRouter.delete("/delete/:id", auth, deleteClient);

export default clientRouter;
