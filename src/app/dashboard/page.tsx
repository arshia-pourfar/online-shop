'use client';

import { useEffect, useState } from 'react';
import { User } from '../../types/user';
import { Order } from '../../types/order';
import { Product } from '../../types/product';
import { getUsers } from '@/lib/api/users';
import { getOrders } from '@/lib/api/orders';
import { getProducts } from '@/lib/api/products';

// type User = {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// };

// type Product = {
//   id: string;
//   name: string;
//   price: Float;
//   description: string?;
//   imageUrl: string?;
//   orders: OrderItem[];
//   createdAt: DateTime;
// };

// type Order = {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getUsers().then(setUsers),
      getOrders().then(setOrders),
      getProducts().then(setProducts),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="">

      <ul className="space-y-2 text-black">
        {users.map((user) => (
          <li key={user.id} className="p-4 bg-gray-100 rounded-md shadow">
            <strong>{user.name}</strong> - {user.email} - <em>{user.role}</em>

          </li>
        ))}
        {orders.map((order) => (
          <li key={order.id} className="p-4 bg-gray-100 rounded-md shadow">
            <strong>{order.userId}</strong> - {order.total} - <em>{order.status}</em>
          </li>
        ))}
        {products.map((product) => (
          <li key={product.id} className="p-4 bg-gray-100 rounded-md shadow">
            <strong>{product.name}</strong> - {product.price} - <em>{product.description}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
