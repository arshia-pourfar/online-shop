import axios from 'axios';
const API_BASE = 'http://localhost:5000';

export async function fetchOrders() {
  const res = await axios.get(`${API_BASE}/orders`);
  return res.data;
}

export async function createOrder(orderData: {
  userId: string;
  items: { productId: string; quantity: number }[];
  total: number;
  status?: string;
}) {
  const res = await axios.post(`${API_BASE}/orders`, orderData);
  return res.data;
} 