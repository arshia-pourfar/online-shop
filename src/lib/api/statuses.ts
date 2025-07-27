const API_BASE = 'http://localhost:5000';

export async function getProductStatuses() {
    try {
        const res = await fetch(`${API_BASE}/api/statuses/productStatuses`);
        if (!res.ok) {
            throw new Error("Failed to fetch statuses");
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("getStatuses error:", error);
        return [];
    }
}
export async function getCustomerStatuses() {
    try {
        const res = await fetch(`${API_BASE}/api/statuses/customerStatuses`);
        if (!res.ok) {
            throw new Error("Failed to fetch statuses");
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("getStatuses error:", error);
        return [];
    }
}
