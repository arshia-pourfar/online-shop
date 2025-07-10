import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser
} from '../controllers/userController';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.delete('/:id', deleteUser);

export default router;
