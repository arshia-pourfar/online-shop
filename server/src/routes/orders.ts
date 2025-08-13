import express from 'express';
import {
    getAllOrders,
    getOrderById,
    createOrder,
    deleteOrder,
    addItemToOrder,
    getPendingOrderByUser,
    deleteOrderItem,
    updateOrderItemQuantity,
} from '../controllers/orderController';

const router = express.Router();

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.get('/user/:userId', getPendingOrderByUser);
router.post('/:orderId/items', addItemToOrder);
router.delete('/items/:id', deleteOrderItem);
router.patch('/items/:id', updateOrderItemQuantity);
router.post('/', createOrder);
router.delete('/:id', deleteOrder);

export default router;
