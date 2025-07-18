import express from 'express';
import { getMonthlyStats } from '../controllers/salestatsController';

const router = express.Router();

// GET /api/stats/monthly
router.get('/', getMonthlyStats);

export default router;
