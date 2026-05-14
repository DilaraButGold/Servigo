-- CreateTable
CREATE TABLE "Veli" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Veli_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sofor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plaka" TEXT NOT NULL,
    "aracTipi" TEXT,
    "kapasite" INTEGER NOT NULL DEFAULT 20,

    CONSTRAINT "Sofor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ogretmen" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sinif" TEXT,

    CONSTRAINT "Ogretmen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ogrenci" (
    "id" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "soyad" TEXT NOT NULL,
    "sinif" TEXT NOT NULL,
    "veliId" TEXT NOT NULL,
    "soforId" TEXT,
    "adres" TEXT NOT NULL,
    "mesafeKm" DOUBLE PRECISION NOT NULL,
    "aylikUcret" DOUBLE PRECISION NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Ogrenci_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Veli_userId_key" ON "Veli"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Sofor_userId_key" ON "Sofor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Ogretmen_userId_key" ON "Ogretmen"("userId");

-- CreateIndex
CREATE INDEX "Ogrenci_veliId_idx" ON "Ogrenci"("veliId");

-- CreateIndex
CREATE INDEX "Ogrenci_soforId_idx" ON "Ogrenci"("soforId");

-- AddForeignKey
ALTER TABLE "Veli" ADD CONSTRAINT "Veli_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sofor" ADD CONSTRAINT "Sofor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ogretmen" ADD CONSTRAINT "Ogretmen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ogrenci" ADD CONSTRAINT "Ogrenci_veliId_fkey" FOREIGN KEY ("veliId") REFERENCES "Veli"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ogrenci" ADD CONSTRAINT "Ogrenci_soforId_fkey" FOREIGN KEY ("soforId") REFERENCES "Sofor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
