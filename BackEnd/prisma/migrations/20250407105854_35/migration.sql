/*
  Warnings:

  - Changed the type of `nomeSorteioDanca` on the `PreferenciaSorteioDanca` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PreferenciaSorteioDanca" DROP COLUMN "nomeSorteioDanca",
ADD COLUMN     "nomeSorteioDanca" "DancaSalaoTradicional" NOT NULL;
