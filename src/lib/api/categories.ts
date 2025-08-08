const API_BASE = 'https://order-dashboard-backend.vercel.app';
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
