/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[company]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `token` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX `User_email_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `email`,
    ADD COLUMN `company` VARCHAR(191) NOT NULL,
    ADD COLUMN `role` ENUM('GUEST', 'USER', 'ADMIN') NOT NULL DEFAULT 'GUEST',
    ADD COLUMN `token` VARCHAR(191) NOT NULL,
    ADD COLUMN `verifiedEmail` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `User_company_key` ON `User`(`company`);
