import { Router } from "express";
import { getStats, redirect, shortner } from "../controllers/urlController.js";
const router = Router();

router.post("/shorten",shortner);
router.get("/stats/:short_id",getStats);
router.get("/:short_id",redirect);

export default router;
                              