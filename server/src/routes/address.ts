import express from 'express';
import { createAddress, getUserAddresses, updateAddress, deleteAddress, getAddressById } from '../controllers/addressController';

const router = express.Router();

router.post('/users/:userId/addresses', createAddress);
router.get('/users/:userId/addresses', getUserAddresses);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);
router.get('/addresses/:id', getAddressById);

export default router;
