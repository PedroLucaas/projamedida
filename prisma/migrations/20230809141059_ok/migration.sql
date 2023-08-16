/*
  Warnings:

  - You are about to drop the column `role` on the `Token` table. All the data in the column will be lost.
  - Added the required column `type` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Token` DROP COLUMN `role`,
    ADD COLUMN `type` ENUM('ADMIN', 'USER', 'GUEST', 'RESETPASSWORD') NOT NULL;
