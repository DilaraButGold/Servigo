import prisma from '../lib/prisma';

export async function getKmFiyat(): Promise<number> {
    const kural = await prisma.aylikUcretKurali.findFirst({
        orderBy: { guncellenmeTarihi: 'desc' }
    });
    return kural?.kmBasinaFiyat || 3.5;
}

export function hesaplaAylikUcret(mesafeKm: number, kmFiyat: number): number {
    const aylikKm = mesafeKm * 2 * 22;
    const hesaplanan = aylikKm * kmFiyat;
    const minimum = 300;
    return Math.max(hesaplanan, minimum);
}

export async function updateOgrenciUcret(ogrenciId: string) {
    const ogrenci = await prisma.ogrenci.findUnique({ where: { id: ogrenciId } });
    if (!ogrenci) return;
    const kmFiyat = await getKmFiyat();
    const yeniUcret = hesaplaAylikUcret(ogrenci.mesafeKm, kmFiyat);
    await prisma.ogrenci.update({
        where: { id: ogrenciId },
        data: { aylikUcret: yeniUcret }
    });
}