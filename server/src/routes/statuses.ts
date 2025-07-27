// routes/api.ts یا هرجایی که روت‌ها را می‌نویسی
import express from "express";
import { getCustomerStatuses, getProductStatuses } from "../controllers/statusController";

const router = express.Router();

router.get("/productStatuses", getProductStatuses);
router.get("/customerStatuses", getCustomerStatuses);

export default router;
