const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export async function getCategories() {
    try {
        const res = await fetch(`${API_BASE}/api/categories`);
        if (!res.ok) {
            throw new Error("Failed to fetch categories");
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("getCategories error:", error);
        return [];
    }
}
