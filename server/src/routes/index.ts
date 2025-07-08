import { Router } from 'express';

const router = Router();

router.get('/orders', (req, res) => {
  res.json([{ id: 1, customer: 'John Doe', total: 100 }]);
});

export default router; 