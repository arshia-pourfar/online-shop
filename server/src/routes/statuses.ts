// routes/api.ts یا هرجایی که روت‌ها را می‌نویسی
import express from "express";
import { getCustomerStatuses, getOrderStatuses, getProductStatuses } from "../controllers/statusController";

const router = express.Router();

router.get("/productStatuses", getProductStatuses);
router.get("/customerStatuses", getCustomerStatuses);
router.get("/orderStatuses", getOrderStatuses);

export default router;
