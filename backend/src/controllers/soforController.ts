import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

export const getAllSofors = async (req: Request, res: Response) => {
    const sofors = await prisma.sofor.findMany({
        include: { user: { select: { id: true, email: true, name: true, phone: true } }, ogrenciler: true }
    });
    res.json(sofors);
};

export const getSoforById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const sofor = await prisma.sofor.findUnique({
        where: { id },
        include: { user: true, ogrenciler: true }
    });
    if (!sofor) return res.status(404).json({ error: 'Şoför bulunamadı' });
    res.json(sofor);
};

export const createSofor = async (req: Request, res: Response) => {
    const { email, password, name, phone, plaka, aracTipi, kapasite } = req.body;
    if (!email || !password || !name || !plaka) {
        return res.status(400).json({ error: 'Eksik alanlar (email, şifre, isim, plaka zorunlu)' });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email zaten kayıtlı' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { email, password: hashedPassword, name, phone, role: 'SOFOR' }
    });
    const sofor = await prisma.sofor.create({
        data: { userId: user.id, plaka, aracTipi, kapasite: kapasite || 20 }
    });
    res.status(201).json({ sofor, user });
};

export const updateSofor = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, name, phone, plaka, aracTipi, kapasite } = req.body;
    const sofor = await prisma.sofor.findUnique({ where: { id }, include: { user: true } });
    if (!sofor) return res.status(404).json({ error: 'Şoför bulunamadı' });

    await prisma.user.update({
        where: { id: sofor.userId },
        data: { email, name, phone }
    });
    await prisma.sofor.update({
        where: { id },
        data: { plaka, aracTipi, kapasite }
    });
    res.json({ message: 'Şoför güncellendi' });
};

export const deleteSofor = async (req: Request, res: Response) => {
    const { id } = req.params;
    const sofor = await prisma.sofor.findUnique({ where: { id } });
    if (!sofor) return res.status(404).json({ error: 'Şoför bulunamadı' });
    await prisma.user.delete({ where: { id: sofor.userId } });
    res.json({ message: 'Şoför silindi' });
};