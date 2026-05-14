import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

export const getAllOgretmen = async (req: Request, res: Response) => {
    const ogretmenler = await prisma.ogretmen.findMany({
        include: { user: { select: { id: true, email: true, name: true, phone: true } } }
    });
    res.json(ogretmenler);
};

export const getOgretmenById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const ogretmen = await prisma.ogretmen.findUnique({
        where: { id },
        include: { user: true }
    });
    if (!ogretmen) return res.status(404).json({ error: 'Öğretmen bulunamadı' });
    res.json(ogretmen);
};

export const createOgretmen = async (req: Request, res: Response) => {
    const { email, password, name, phone, sinif } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Eksik alanlar' });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email zaten kayıtlı' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { email, password: hashedPassword, name, phone, role: 'OGRETMEN' }
    });
    const ogretmen = await prisma.ogretmen.create({
        data: { userId: user.id, sinif }
    });
    res.status(201).json({ ogretmen, user });
};

export const updateOgretmen = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, name, phone, sinif } = req.body;
    const ogretmen = await prisma.ogretmen.findUnique({ where: { id }, include: { user: true } });
    if (!ogretmen) return res.status(404).json({ error: 'Öğretmen bulunamadı' });

    await prisma.user.update({
        where: { id: ogretmen.userId },
        data: { email, name, phone }
    });
    await prisma.ogretmen.update({
        where: { id },
        data: { sinif }
    });
    res.json({ message: 'Öğretmen güncellendi' });
};

export const deleteOgretmen = async (req: Request, res: Response) => {
    const { id } = req.params;
    const ogretmen = await prisma.ogretmen.findUnique({ where: { id } });
    if (!ogretmen) return res.status(404).json({ error: 'Öğretmen bulunamadı' });
    await prisma.user.delete({ where: { id: ogretmen.userId } });
    res.json({ message: 'Öğretmen silindi' });
};