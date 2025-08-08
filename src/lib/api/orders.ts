// lib/api/orders.ts (New API Service File)
import { Order } from "../../types/order";
const API_BASE = 'https://order-dashboard-backend.vercel.app';

export async function getOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/api/orders`);
  if (!res.ok) {
    throw new Error("Failed to fetch orders");
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

export async function updateOrder(id: number, order: Partial<Order>): Promise<Order> {
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

export async function deleteOrder(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/orders/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete order");
  }
}