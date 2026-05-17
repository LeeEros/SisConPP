/*
  Warnings:

  - Added the required column `nomeSorteioDanca` to the `PreferenciaSorteioDanca` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PreferenciaSorteioDanca" ADD COLUMN     "nomeSorteioDanca" TEXT NOT NULL;
