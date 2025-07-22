import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
} from '../controllers/productController';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
