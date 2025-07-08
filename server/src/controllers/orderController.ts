import { Request, Response } from 'express';

export const getOrders = (req: Request, res: Response) => {
  res.json([{ id: 1, customer: 'John Doe', total: 100 }]);
}; 