import express from 'express';
import {
    getAllOrders,
    getOrderById,
    createOrder,
    deleteOrder,
} from '../controllers/orderController';

const router = express.Router();

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.delete('/:id', deleteOrder);

export default router;
