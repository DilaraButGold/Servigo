-- CreateTable
CREATE TABLE "KonumGecmisi" (
    "id" TEXT NOT NULL,
    "soforId" TEXT NOT NULL,
    "enlem" DOUBLE PRECISION NOT NULL,
    "boylam" DOUBLE PRECISION NOT NULL,
    "hiz" DOUBLE PRECISION,
    "yon" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KonumGecmisi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServisSeferi" (
    "id" TEXT NOT NULL,
    "soforId" TEXT NOT NULL,
    "baslangic" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bitis" TIMESTAMP(3),
    "rotaJson" JSONB,
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ServisSeferi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KonumGecmisi_soforId_idx" ON "KonumGecmisi"("soforId");

-- CreateIndex
CREATE INDEX "KonumGecmisi_createdAt_idx" ON "KonumGecmisi"("createdAt");

-- CreateIndex
CREATE INDEX "ServisSeferi_soforId_aktif_idx" ON "ServisSeferi"("soforId", "aktif");

-- AddForeignKey
ALTER TABLE "KonumGecmisi" ADD CONSTRAINT "KonumGecmisi_soforId_fkey" FOREIGN KEY ("soforId") REFERENCES "Sofor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServisSeferi" ADD CONSTRAINT "ServisSeferi_soforId_fkey" FOREIGN KEY ("soforId") REFERENCES "Sofor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
