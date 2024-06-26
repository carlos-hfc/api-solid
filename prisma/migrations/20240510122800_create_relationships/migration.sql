/*
  Warnings:

  - Added the required column `gymId` to the `checkIns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `checkIns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `checkins` ADD COLUMN `gymId` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `checkIns` ADD CONSTRAINT `checkIns_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkIns` ADD CONSTRAINT `checkIns_gymId_fkey` FOREIGN KEY (`gymId`) REFERENCES `gyms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
