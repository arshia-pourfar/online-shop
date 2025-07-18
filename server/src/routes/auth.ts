import express from 'express';
import { loginUser } from '../controllers/authController';

const router = express.Router();

router.post('/login', loginUser);

export default router;
