// lib/api/orders.ts (New API Service File)
import { Order } from "../../types/order";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
// const API_BASE = 'http://localhost:5000';


export async function getOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/api/orders`);
  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }
  return res.json();
}

export async function getAllOrdersByUser(userId: string): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/api/orders/user/${userId}/all`);
  if (!res.ok) {
    throw new Error("Failed to fetch user's full order history");
  }
  return res.json();
}

export async function getCartByUserId(userId: string) {
  const res = await fetch(`${API_BASE}/api/orders/user/${userId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch user's orders");
  }
  return res.json();
}

export async function addOrder(order: Partial<Order>): Promise<Order> {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!res.ok) {
    throw new Error("Failed to add order");
  }
  return res.json();
}

export async function updateOrder(id: string, order: Partial<Order>): Promise<Order> {
  const res = await fetch(`${API_BASE}/api/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!res.ok) {
    throw new Error("Failed to update order");
  }
  return res.json();
}

export async function deleteOrder(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/orders/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete order");
  }
}