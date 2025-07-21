import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import userRoutes from './routes/users';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import salestateRoutes from './routes/salestats';
import authRoutes from './routes/auth';
import categoryRoutes from './routes/categories';
import statusRoutes from './routes/statuses';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/salestats', salestateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/statuses', statusRoutes);

app.get('/', (_, res) => {
  res.send('✅ Server is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log('JWT_SECRET is:', process.env.JWT_SECRET); // برای تست مقدار JWT_SECRET
});
