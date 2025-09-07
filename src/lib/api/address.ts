// lib/api/address.ts
import { Address } from "../../types/address";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function getAddressesByUser(userId: string): Promise<Address[]> {
    const res = await fetch(`${API_BASE}/api/users/${userId}/addresses`);
    if (!res.ok) throw new Error("Failed to fetch addresses");
    return res.json();
}

export async function addAddress(userId: string, address: Omit<Address, "id" | "userId">): Promise<Address> {
    const res = await fetch(`${API_BASE}/api/users/${userId}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
    });
    if (!res.ok) throw new Error("Failed to add address");
    return res.json();
}

export async function deleteAddress(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/api/addresses/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete address");
}
