import { Router } from "express";
import { createOrUpdateConfig, deleteAllConfigs, deleteConfig, getAllConfigs, getConfig } from "../controllers/admin.controller";

const router = Router();

router.get("/config", getAllConfigs);
router.get("/config/:clientKey", getConfig);
router.delete("/config/:clientKey", deleteConfig);
router.delete("/config", deleteAllConfigs);
router.post("/config", createOrUpdateConfig);

export default router;