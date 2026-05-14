import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Tüm öğrenciler
export const getAllOgrenciler = async (req: Request, res: Response) => {
    const ogrenciler = await prisma.ogrenci.findMany({
        include: { veli: { include: { user: true } }, sofor: { include: { user: true } } }
    });
    res.json(ogrenciler);
};

// Tek öğrenci
export const getOgrenciById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const ogrenci = await prisma.ogrenci.findUnique({
        where: { id },
        include: { veli: true, sofor: true }
    });
    if (!ogrenci) return res.status(404).json({ error: 'Öğrenci bulunamadı' });
    res.json(ogrenci);
};

// Yeni öğrenci
export const createOgrenci = async (req: Request, res: Response) => {
    const { ad, soyad, sinif, veliId, soforId, adres, mesafeKm, aylikUcret, aktif } = req.body;
    if (!ad || !soyad || !veliId || !adres || mesafeKm === undefined) {
        return res.status(400).json({ error: 'Gerekli alanlar eksik' });
    }
    const ogrenci = await prisma.ogrenci.create({
        data: {
            ad, soyad, sinif, veliId, soforId, adres, mesafeKm,
            aylikUcret: aylikUcret || 0,
            aktif: aktif !== undefined ? aktif : true
        }
    });
    res.status(201).json(ogrenci);
};

// Güncelle
export const updateOgrenci = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ad, soyad, sinif, veliId, soforId, adres, mesafeKm, aylikUcret, aktif } = req.body;
    const ogrenci = await prisma.ogrenci.update({
        where: { id },
        data: { ad, soyad, sinif, veliId, soforId, adres, mesafeKm, aylikUcret, aktif }
    });
    res.json(ogrenci);
};

// Sil
export const deleteOgrenci = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.ogrenci.delete({ where: { id } });
    res.json({ message: 'Öğrenci silindi' });
};