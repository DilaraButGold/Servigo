import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const setKmFiyat = async (req: Request, res: Response) => {
    try {
        const { kmBasinaFiyat, minimumUcret } = req.body;
        const kural = await prisma.aylikUcretKurali.create({
            data: { kmBasinaFiyat, minimumUcret: minimumUcret || 300 },
        });
        res.status(201).json(kural);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};

export const getKmFiyat = async (req: Request, res: Response) => {
    try {
        const kural = await prisma.aylikUcretKurali.findFirst({
            orderBy: { guncellenmeTarihi: 'desc' },
        });
        res.json(kural || { kmBasinaFiyat: 3.5, minimumUcret: 300 });
    } catch (error) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};