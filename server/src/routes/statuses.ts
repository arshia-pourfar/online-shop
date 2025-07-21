// routes/api.ts یا هرجایی که روت‌ها را می‌نویسی
import express from "express";
import { getProductStatuses } from "../controllers/statusController";

const router = express.Router();

router.get("/", getProductStatuses);

export default router;
