import { Router } from "express";
import { createUrl, getStats, getUrl } from "../controller/urlController.js";

const router = Router();

router.post("/create", createUrl);
router.get("/stats/:shortUrl", getStats);
router.get("/:shortUrl", getUrl);

export default router;
