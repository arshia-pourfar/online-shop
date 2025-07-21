"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/api.ts یا هرجایی که روت‌ها را می‌نویسی
const express_1 = __importDefault(require("express"));
const statusController_1 = require("../controllers/statusController");
const router = express_1.default.Router();
router.get("/", statusController_1.getProductStatuses);
exports.default = router;
