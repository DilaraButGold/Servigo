-- CreateEnum
CREATE TYPE "DevamsizlikTipi" AS ENUM ('GELMIYOR', 'GEC_KALACAK', 'ERKEN_CIKIS');

-- AlterTable
ALTER TABLE "Ogrenci" ALTER COLUMN "sinif" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Devamsizlik" (
    "id" TEXT NOT NULL,
    "ogrenciId" TEXT NOT NULL,
    "soforId" TEXT,
    "tarih" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "neden" TEXT,
    "gecikmeDk" INTEGER,
    "tip" "DevamsizlikTipi" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Devamsizlik_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Devamsizlik" ADD CONSTRAINT "Devamsizlik_ogrenciId_fkey" FOREIGN KEY ("ogrenciId") REFERENCES "Ogrenci"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Devamsizlik" ADD CONSTRAINT "Devamsizlik_soforId_fkey" FOREIGN KEY ("soforId") REFERENCES "Sofor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
