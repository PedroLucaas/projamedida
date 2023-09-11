/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Provider_email_key` ON `Provider`(`email`);
