import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createDevamsizlik = async (req: Request, res: Response) => {
    try {
        const { ogrenciId, neden, gecikmeDk, tip } = req.body;

        if (!ogrenciId || !tip) {
            return res.status(400).json({ error: 'Öğrenci ID ve tip (GELMIYOR/GEC_KALACAK/ERKEN_CIKIS) zorunlu' });
        }

        // Öğrenciyi ve şoförünü bul
        const ogrenci = await prisma.ogrenci.findUnique({
            where: { id: ogrenciId },
            include: { sofor: { include: { user: true } }, veli: { include: { user: true } } }
        });
        if (!ogrenci) {
            return res.status(404).json({ error: 'Öğrenci bulunamadı' });
        }
        if (!ogrenci.sofor) {
            return res.status(400).json({ error: 'Bu öğrenciye henüz şoför atanmamış' });
        }

        // Devamsızlık kaydı oluştur
        const devamsizlik = await prisma.devamsizlik.create({
            data: {
                ogrenciId,
                soforId: ogrenci.sofor.id,
                neden,
                gecikmeDk,
                tip
            }
        });

        // Socket.io ile şoföre bildirim gönder
        const io = req.app.get('io');
        const soforRoom = `sofor_${ogrenci.sofor.id}`;
        io.to(soforRoom).emit('devamsizlik_bildirimi', {
            ogrenciAd: ogrenci.ad,
            ogrenciSoyad: ogrenci.soyad,
            tip,
            neden,
            gecikmeDk,
            tarih: new Date()
        });

        // Ayrıca veliye de onay bildirimi gönderebiliriz (isteğe bağlı)
        // io.to(`veli_${ogrenci.veli.id}`).emit(...)

        res.status(201).json({ message: 'Bildirim gönderildi', devamsizlik });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};

// Şoförün bugünkü devamsızlıkları listesi (opsiyonel)
export const getTodayBySofor = async (req: Request, res: Response) => {
    const { soforId } = req.params;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const list = await prisma.devamsizlik.findMany({
        where: {
            soforId,
            tarih: { gte: startOfDay, lte: endOfDay }
        },
        include: { ogrenci: true }
    });
    res.json(list);
};