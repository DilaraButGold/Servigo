import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { ensureStudentQR, generateQRCodeDataURL } from '../services/qrService';

export const submitAttendance = async (req: AuthRequest, res: Response) => {
    try {
        const { qrKod, tip, enlem, boylam } = req.body;
        if (!qrKod || !tip) {
            return res.status(400).json({ error: 'QR kod ve tip (BINIS/INIS) zorunlu' });
        }

        const ogrenci = await prisma.ogrenci.findUnique({
            where: { qrKod },
            include: { veli: { include: { user: true } }, sofor: true }
        });
        if (!ogrenci) return res.status(404).json({ error: 'Geçersiz QR kod' });

        const sofor = await prisma.sofor.findUnique({
            where: { userId: req.user!.id }
        });
        if (!sofor) return res.status(403).json({ error: 'Şoför kaydı bulunamadı' });

        const yoklama = await prisma.yoklama.create({
            data: {
                ogrenciId: ogrenci.id,
                soforId: sofor.id,
                tip,
                konum: (enlem && boylam) ? { enlem, boylam } : undefined
            }
        });

        const io = req.app.get('io');
        io.to(`veli_${ogrenci.veli.id}`).emit('yoklama_bildirimi', {
            ogrenciAd: ogrenci.ad,
            ogrenciSoyad: ogrenci.soyad,
            tip,
            zaman: yoklama.createdAt
        });

        res.status(201).json({ message: 'Yoklama kaydedildi', yoklama });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};

export const getMyStudentAttendance = async (req: AuthRequest, res: Response) => {
    try {
        const veli = await prisma.veli.findUnique({
            where: { userId: req.user!.id },
            include: { ogrenciler: true }
        });
        if (!veli) return res.status(404).json({ error: 'Veli bulunamadı' });

        const yoklamalar = await prisma.yoklama.findMany({
            where: { ogrenciId: { in: veli.ogrenciler.map(o => o.id) } },
            include: { ogrenci: true, sofor: { include: { user: true } } },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        res.json(yoklamalar);
    } catch (error) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};

export const getStudentQR = async (req: Request, res: Response) => {
    const { ogrenciId } = req.params;
    const ogrenci = await prisma.ogrenci.findUnique({ where: { id: ogrenciId } });
    if (!ogrenci) return res.status(404).json({ error: 'Öğrenci bulunamadı' });

    const qrText = await ensureStudentQR(ogrenciId);
    const qrImage = await generateQRCodeDataURL(qrText);
    res.json({ qrText, qrImage });
};