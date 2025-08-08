// src/api/salestats.ts
import { SaleStats } from '../../types/salestats';
const API_BASE = 'https://order-dashboard-backend.vercel.app';

export async function getSaleStats(): Promise<SaleStats[]> {
    const res = await fetch(`${API_BASE}/api/salestats`);
    if (!res.ok) throw new Error('Failed to fetch sales stats');
    return res.json();
}

export async function getSaleStatById(id: number): Promise<SaleStats> {
    const res = await fetch(`${API_BASE}/api/salestats/${id}`);
    if (!res.ok) throw new Error('Failed to fetch sales stat');
    return res.json();
}

export async function createSaleStat(data: {
    year: number;
    month: number;
    orderCount: number;
    revenue: number;
}): Promise<SaleStats> {
    const res = await fetch(`${API_BASE}/api/salestats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create sales stat');
    return res.json();
}

export async function deleteSaleStat(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/api/salestats/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete sales stat');
    return res.json();
}
