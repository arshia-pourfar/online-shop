import { NextApiRequest, NextApiResponse } from "next";

export default function handlerhandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const allStatuses = {
            productStatuses: ["AVAILABLE", "OUT_OF_STOCK", "DISCONTINUED", "COMING_SOON", "HIDDEN"],
            customerStatuses: ["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"],
            orderStatuses: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
        };
        res.json(allStatuses);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
