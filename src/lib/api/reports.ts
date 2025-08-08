import { Report } from '../../types/report';
const API_BASE = 'http://localhost:5000';

/**
 * Fetches all reports from the backend API, including author name.
 */
export async function getReports(): Promise<Report[]> {
    const res = await fetch(`${API_BASE}/api/reports`);
    if (!res.ok) {
        throw new Error('Failed to fetch reports');
    }

    const data: Report[] = await res.json();

    // Optionally convert string date to Date object
    return data.map(report => ({
        ...report,
        reportDate: new Date(report.reportDate), // or keep it as Date if needed
    }));
}

export async function getReportById(id: string): Promise<Report> {
    const res = await fetch(`${API_BASE}/api/reports/${id}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch report with ID: ${id}`);
    }
    return res.json();
}

export async function saveReport(report: Partial<Report>) {
    const payload = {
        title: report.title,
        type: report.type,
        reportDate: report.reportDate,
        authorId: report.authorId,
        status: report.status,
        fileUrl: report.fileUrl || null,
    };

    const method = report.id ? "PUT" : "POST";
    const url = report.id ? `${API_BASE}/api/reports/${report.id}` : `${API_BASE}/api/reports`;

    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to save report: ${errorText}`);
    }

    return await res.json();
}

export async function deleteReport(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/api/reports/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete report: ${errorText}`);
    }
    return res.json();
}
