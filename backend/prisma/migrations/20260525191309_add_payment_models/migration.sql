-- CreateEnum
CREATE TYPE "OdemeDurum" AS ENUM ('BEKLIYOR', 'ODENDI', 'GECIKTI');

-- CreateEnum
CREATE TYPE "OdemeTipi" AS ENUM ('ONLINE', 'MANUEL');

-- CreateTable
CREATE TABLE "AylikUcretKurali" (
    "id" TEXT NOT NULL,
    "kmBasinaFiyat" DOUBLE PRECISION NOT NULL,
    "minimumUcret" DOUBLE PRECISION NOT NULL,
    "guncellenmeTarihi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AylikUcretKurali_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Odeme" (
    "id" TEXT NOT NULL,
    "ogrenciId" TEXT NOT NULL,
    "tutar" DOUBLE PRECISION NOT NULL,
    "ay" INTEGER NOT NULL,
    "yil" INTEGER NOT NULL,
    "durum" "OdemeDurum" NOT NULL,
    "odemeTipi" "OdemeTipi" NOT NULL,
    "islemId" TEXT,
    "makbuzUrl" TEXT,
    "odenmeTarihi" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Odeme_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Odeme" ADD CONSTRAINT "Odeme_ogrenciId_fkey" FOREIGN KEY ("ogrenciId") REFERENCES "Ogrenci"("id") ON DELETE CASCADE ON UPDATE CASCADE;
