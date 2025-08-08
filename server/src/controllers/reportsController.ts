import { Request, Response } from 'express';
import {prisma} from '../../prisma/prisma';

export const getReports = async (req: Request, res: Response) => {
    try {
        const reports = await prisma.report.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error getting reports:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export async function updateReport(req: Request, res: Response) {
    try {
        const id = req.params.id;  // رشته
        const { title, type, reportDate, authorId, status, fileUrl } = req.body;

        const existingReport = await prisma.report.findUnique({ where: { id } });
        if (!existingReport) {
            return res.status(404).json({ message: 'Report not found' });
        }

        const updatedReport = await prisma.report.update({
            where: { id },
            data: {
                title,
                type,
                reportDate: new Date(reportDate),
                authorId,
                status,
                fileUrl,
            },
        });

        res.json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const answerReport = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const existingReport = await prisma.report.findUnique({ where: { id } });
        if (!existingReport) {
            return res.status(404).json({ message: 'Report not found' });
        }

        const answeredReport = await prisma.report.update({
            where: { id },
            data: { status: 'ANSWERED' },
        });

        res.status(200).json(answeredReport);
    } catch (error) {
        console.error('Error answering report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const blockReport = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const existingReport = await prisma.report.findUnique({ where: { id } });
        if (!existingReport) {
            return res.status(404).json({ message: 'Report not found' });
        }

        const blockedReport = await prisma.report.update({
            where: { id },
            data: { status: 'BLOCKED' },
        });

        res.status(200).json(blockedReport);
    } catch (error) {
        console.error('Error blocking report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteReport = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const existingReport = await prisma.report.findUnique({ where: { id } });
        if (!existingReport) {
            return res.status(404).json({ message: 'Report not found' });
        }

        await prisma.report.delete({ where: { id } });
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
