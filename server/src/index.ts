import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRoutes from './routes/users';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (_, res) => {
  res.send('✅ Server is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
