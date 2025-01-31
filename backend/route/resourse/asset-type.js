import express from "express";
import {
  createAssetType,
  deleteAssetType,
  getAssetType,
  updateAssetType,
} from "../../controller/resourse/asset-type.js";
import { auth } from "../../middleware/auth.middleware.js";
const assetTypeRouter = express.Router();

assetTypeRouter.post("/create", auth, createAssetType);
assetTypeRouter.get("/get", auth, getAssetType);
assetTypeRouter.put("/update/:id", auth, updateAssetType);
assetTypeRouter.delete("/delete/:id", auth, deleteAssetType);
export default assetTypeRouter;
