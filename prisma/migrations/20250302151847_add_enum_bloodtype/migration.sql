/*
  Warnings:

  - Added the required column `bloodType` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('O_PLUS', 'O_MINUS', 'A_PLUS', 'A_MINUS', 'B_PLUS', 'B_MINUS', 'AB_PLUS', 'AB_MINUS');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "bloodType",
ADD COLUMN     "bloodType" "BloodType" NOT NULL;
