export type Report = {
    id: number;
    title: string;
    type: "SALES" | "INVENTORY" | "CUSTOMER" | "SYSTEM";
    status: "GENERATED" | "BLOCKED" | "FAILED" | "IN_PROGRESS" | "HIDDEN" | "ANSWERED";
    reportDate: Date;
    fileUrl: string | null;
    authorId: number;
    author?: {
        name: string;
    };
    generatedBy?: string;

    [key: string]: unknown;
};