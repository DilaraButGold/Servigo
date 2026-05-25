export function hesaplaAylikUcret(mesafeKm: number, kmBasinaFiyat: number, minimumUcret: number): number {
    const aylikKm = mesafeKm * 2 * 22; // Gidiş + dönüş, 22 iş günü
    const hesaplanan = aylikKm * kmBasinaFiyat;
    return Math.max(hesaplanan, minimumUcret);
}