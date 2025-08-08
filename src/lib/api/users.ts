import { User } from '../../types/user';
const API_BASE = 'http://localhost:5000';

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/api/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function getUserById(id: string): Promise<User> {
  const res = await fetch(`${API_BASE}/api/users/${id}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function createUser(data: {
  name: string;
  phone: string;
  email: string;
  status: string;
  password: string;
  role: string;
}): Promise<User> {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/users/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
}
