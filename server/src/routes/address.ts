import express from 'express';
import { createAddress, getUserAddresses, updateAddress, deleteAddress } from '../controllers/addressController';

const router = express.Router();

router.post('/users/:userId/addresses', createAddress);
router.get('/users/:userId/addresses', getUserAddresses);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;
