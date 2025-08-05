import express from 'express';
import {
    getReports,
    updateReport,
    answerReport,
    blockReport,
    deleteReport,
} from '../controllers/reportsController';

const router = express.Router();

router.get('/', getReports);
router.put('/:id', updateReport);
router.post('/:id/answer', answerReport);
router.post('/:id/block', blockReport);
router.delete('/:id', deleteReport);

export default router;
