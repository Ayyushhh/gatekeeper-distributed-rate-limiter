import { Router } from "express";
import { checkRateLimit } from "../controllers/rate-limit.controller";

const router = Router();

router.post("/check", checkRateLimit);

export default router;