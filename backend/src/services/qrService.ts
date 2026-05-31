import QRCode from 'qrcode';
import prisma from '../lib/prisma';
import crypto from 'crypto';

export function generateQRText(ogrenciId: string): string {
    return `servigo:${ogrenciId}:${crypto.randomBytes(8).toString('hex')}`;
}

export async function generateQRCodeDataURL(text: string): Promise<string> {
    return await QRCode.toDataURL(text);
}

export async function ensureStudentQR(ogrenciId: string): Promise<string> {
    const ogrenci = await prisma.ogrenci.findUnique({ where: { id: ogrenciId } });
    if (!ogrenci) throw new Error('Öğrenci bulunamadı');
    if (ogrenci.qrKod) return ogrenci.qrKod;

    const qrText = generateQRText(ogrenciId);
    await prisma.ogrenci.update({
        where: { id: ogrenciId },
        data: { qrKod: qrText }
    });
    return qrText;
}