const API_BASE = 'http://localhost:5000';

export async function getStatuses() {
    try {
        const res = await fetch(`${API_BASE}/api/statuses`);
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
