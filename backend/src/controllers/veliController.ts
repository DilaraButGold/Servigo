import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

// Tüm velileri listele (admin)
export const getAllVelis = async (req: Request, res: Response) => {
    const velis = await prisma.veli.findMany({
        include: { user: { select: { id: true, email: true, name: true, phone: true } }, ogrenciler: true }
    });
    res.json(velis);
};

// Tek bir veli getir
export const getVeliById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const veli = await prisma.veli.findUnique({
        where: { id },
        include: { user: true, ogrenciler: true }
    });
    if (!veli) return res.status(404).json({ error: 'Veli bulunamadı' });
    res.json(veli);
};

// Yeni veli oluştur (kullanıcı ve veli kaydı birlikte)
export const createVeli = async (req: Request, res: Response) => {
    const { email, password, name, phone, ogrenciIds } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Eksik alanlar' });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email zaten kayıtlı' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { email, password: hashedPassword, name, phone, role: 'VELI' }
    });
    const veli = await prisma.veli.create({
        data: { userId: user.id }
    });
    // İsteğe bağlı: ogrenciIds ile ilişkilendir
    if (ogrenciIds && ogrenciIds.length) {
        await prisma.ogrenci.updateMany({
            where: { id: { in: ogrenciIds } },
            data: { veliId: veli.id }
        });
    }
    res.status(201).json({ veli, user });
};

// Veli güncelle
export const updateVeli = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, name, phone, ogrenciIds } = req.body;
    const veli = await prisma.veli.findUnique({ where: { id }, include: { user: true } });
    if (!veli) return res.status(404).json({ error: 'Veli bulunamadı' });

    await prisma.user.update({
        where: { id: veli.userId },
        data: { email, name, phone }
    });
    if (ogrenciIds) {
        await prisma.ogrenci.updateMany({
            where: { id: { in: ogrenciIds } },
            data: { veliId: id }
        });
    }
    res.json({ message: 'Veli güncellendi' });
};

// Veli sil (kullanıcıyı da siler, cascade)
export const deleteVeli = async (req: Request, res: Response) => {
    const { id } = req.params;
    const veli = await prisma.veli.findUnique({ where: { id } });
    if (!veli) return res.status(404).json({ error: 'Veli bulunamadı' });
    await prisma.user.delete({ where: { id: veli.userId } });
    res.json({ message: 'Veli silindi' });
};