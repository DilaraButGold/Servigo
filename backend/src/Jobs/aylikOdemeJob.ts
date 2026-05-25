import cron from 'node-cron';
import prisma from '../lib/prisma';

export function startMonthlyPaymentJob() {
    // Her ayın 1'i saat 09:00'da çalışır
    cron.schedule('0 9 1 * *', async () => {
        console.log('Aylık ödeme oluşturma işlemi başladı');
        const ogrenciler = await prisma.ogrenci.findMany({ where: { aktif: true } });
        const now = new Date();
        const ay = now.getMonth() + 1;
        const yil = now.getFullYear();

        for (const ogrenci of ogrenciler) {
            const varMi = await prisma.odeme.findFirst({
                where: { ogrenciId: ogrenci.id, ay, yil }
            });
            if (!varMi) {
                await prisma.odeme.create({
                    data: {
                        ogrenciId: ogrenci.id,
                        tutar: ogrenci.aylikUcret,
                        ay,
                        yil,
                        durum: 'BEKLIYOR',
                        odemeTipi: 'MANUEL'
                    }
                });
                // FCM push bildirimi gönderilebilir (ileride eklenecek)
            }
        }
        console.log('Aylık ödemeler oluşturuldu');
    });
}