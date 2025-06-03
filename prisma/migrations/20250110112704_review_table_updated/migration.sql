/*
  Warnings:

  - Added the required column `listingId` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `review` ADD COLUMN `listingId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `listing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
