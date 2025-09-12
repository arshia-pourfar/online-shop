import { Favorite } from "types/favorite";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// گرفتن علاقه‌مندی‌های یک کاربر
export async function getFavoritesByUser(userId: string): Promise<Favorite[]> {
  const res = await fetch(`${API_BASE}/api/favorites/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch favorites');
  return res.json();
}

// افزودن محصول به علاقه‌مندی‌ها
export async function addFavorite(userId: string, productId: number): Promise<Favorite> {
  const res = await fetch(`${API_BASE}/api/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to add favorite: ${errorText}`);
  }

  return res.json();
}

// حذف محصول از علاقه‌مندی‌ها
export async function removeFavorite(userId: string, productId: number): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/favorites`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to remove favorite: ${errorText}`);
  }

  return res.json();
}