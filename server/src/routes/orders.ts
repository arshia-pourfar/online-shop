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
    getAllOrdersByUser,
    updateOrder,
} from '../controllers/orderController';

const router = express.Router();

router.get('/', getAllOrders);
router.get('/user/:userId/all', getAllOrdersByUser);
router.get('/user/:userId', getPendingOrderByUser);
router.get('/:id', getOrderById);
router.post('/:orderId/items', addItemToOrder);
router.delete('/items/:id', deleteOrderItem);
router.patch('/items/:id', updateOrderItemQuantity);
router.post('/', createOrder);
router.delete('/:id', deleteOrder);
router.put("/:id", updateOrder);

export default router;
