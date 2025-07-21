"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salestatsController_1 = require("../controllers/salestatsController");
const router = express_1.default.Router();
// GET /api/stats/monthly
router.get('/', salestatsController_1.getMonthlyStats);
exports.default = router;
