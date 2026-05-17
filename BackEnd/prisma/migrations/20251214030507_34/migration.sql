/*
  Warnings:

  - A unique constraint covering the columns `[candidatoId,nomeSorteioDanca]` on the table `PreferenciaSorteioDanca` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PreferenciaSorteioDanca_candidatoId_nomeSorteioDanca_key" ON "PreferenciaSorteioDanca"("candidatoId", "nomeSorteioDanca");
