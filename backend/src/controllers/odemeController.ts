import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getMyPayments = async (req: AuthRequest, res: Response) => {
    try {
        const veli = await prisma.veli.findUnique({
            where: { userId: req.user!.id },
            include: { ogrenciler: true }
        });
        if (!veli) return res.status(404).json({ error: 'Veli bulunamadı' });
        const odemeler = await prisma.odeme.findMany({
            where: { ogrenciId: { in: veli.ogrenciler.map(o => o.id) } },
            include: { ogrenci: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(odemeler);
    } catch (error) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};

export const getAllPayments = async (req: Request, res: Response) => {
    const odemeler = await prisma.odeme.findMany({
        include: { ogrenci: { include: { veli: { include: { user: true } } } } },
        orderBy: { createdAt: 'desc' }
    });
    res.json(odemeler);
};

export const createManualPayment = async (req: AuthRequest, res: Response) => {
    try {
        const { ogrenciId, ay, yil, tutar, makbuzUrl } = req.body;
        const veli = await prisma.veli.findUnique({
            where: { userId: req.user!.id },
            include: { ogrenciler: true }
        });
        const ogrenci = veli?.ogrenciler.find(o => o.id === ogrenciId);
        if (!ogrenci) return res.status(403).json({ error: 'Bu öğrenci size ait değil' });

        const odeme = await prisma.odeme.create({
            data: {
                ogrenciId,
                tutar,
                ay,
                yil,
                durum: 'BEKLIYOR',
                odemeTipi: 'MANUEL',
                makbuzUrl,
            }
        });
        res.status(201).json(odeme);
    } catch (error) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};

export const approvePayment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const odeme = await prisma.odeme.update({
        where: { id },
        data: { durum: 'ODENDI', odenmeTarihi: new Date() }
    });
    res.json(odeme);
};