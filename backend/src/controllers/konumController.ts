import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const submitLocation = async (req: AuthRequest, res: Response) => {
    try {
        const { enlem, boylam, hiz, yon } = req.body;
        const soforId = req.user?.id; // Şoförün kendi user id'si değil, Sofor modelinin id'si gerekli

        // Gerçek şoför kaydını user üzerinden bul
        const sofor = await prisma.sofor.findUnique({
            where: { userId: req.user!.id }
        });
        if (!sofor) {
            return res.status(403).json({ error: 'Şoför kaydı bulunamadı' });
        }

        const konum = await prisma.konumGecmisi.create({
            data: {
                soforId: sofor.id,
                enlem,
                boylam,
                hiz,
                yon
            }
        });

        // WebSocket ile ilgili velilere yayın
        const io = req.app.get('io');
        // Öğrencileri bul ve veli odalarına emit
        const ogrenciler = await prisma.ogrenci.findMany({
            where: { soforId: sofor.id, aktif: true },
            include: { veli: true }
        });
        const veliIds = [...new Set(ogrenciler.map(o => o.veli.id))];
        veliIds.forEach(veliId => {
            io.to(`veli_${veliId}`).emit('konum_guncelleme', {
                soforId: sofor.id,
                enlem,
                boylam,
                hiz,
                yon,
                timestamp: konum.createdAt
            });
        });

        res.status(201).json({ message: 'Konum kaydedildi' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};

// Son konumu getir (bir şoför için)
export const getLastLocation = async (req: Request, res: Response) => {
    const { soforId } = req.params;
    const konum = await prisma.konumGecmisi.findFirst({
        where: { soforId },
        orderBy: { createdAt: 'desc' }
    });
    res.json(konum);
};