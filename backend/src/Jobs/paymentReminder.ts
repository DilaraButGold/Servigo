import cron from 'node-cron';
import prisma from '../lib/prisma';

export async function generateMonthlyPayments() {
    console.log('Aylık ödeme oluşturma başladı...');
    const now = new Date();
    const ay = now.getMonth() + 1;
    const yil = now.getFullYear();

    const ogrenciler = await prisma.ogrenci.findMany({ where: { aktif: true } });
    for (const ogrenci of ogrenciler) {
        const varMi = await prisma.odeme.findFirst({ where: { ogrenciId: ogrenci.id, ay, yil } });
        if (!varMi) {
            await prisma.odeme.create({
                data: {
                    ogrenciId: ogrenci.id,
                    tutar: ogrenci.aylikUcret,
                    ay,
                    yil,
                    durum: 'BEKLIYOR',
                    odemeTipi: 'MANUEL',
                },
            });
            console.log(`${ogrenci.ad} ${ogrenci.soyad} için ödeme kaydı oluşturuldu.`);
        }
    }
}

export function startPaymentCron() {
    cron.schedule('0 9 1 * *', () => { generateMonthlyPayments(); });
    cron.schedule('0 9 10 * *', async () => {
        const now = new Date();
        const ay = now.getMonth() + 1;
        const yil = now.getFullYear();
        const gecikenler = await prisma.odeme.findMany({
            where: { durum: 'BEKLIYOR', ay, yil },
            include: { ogrenci: { include: { veli: { include: { user: true } } } } },
        });
        for (const odeme of gecikenler) {
            console.log(`Gecikmiş ödeme: ${odeme.ogrenci.ad} ${odeme.ogrenci.soyad} - ${odeme.tutar} TL`);
            // TODO: push bildirimi
        }
    });
}