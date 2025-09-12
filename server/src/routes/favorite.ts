import express from 'express';

import {
    getFavoritesByUser,
    addFavorite,
    removeFavorite,
} from '../controllers/favoriteController';

const router = express.Router();

router.get('/user/:userId', getFavoritesByUser);
router.post('/', addFavorite);
router.delete('/', removeFavorite);

export default router;
