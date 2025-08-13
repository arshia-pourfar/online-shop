// server/src/utils/status.utils.ts

export const ORDER_STATUSES = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
] as const;

export type OrderStatusType = typeof ORDER_STATUSES[number];

export const getOrderStatuses = (): OrderStatusType[] => [...ORDER_STATUSES];