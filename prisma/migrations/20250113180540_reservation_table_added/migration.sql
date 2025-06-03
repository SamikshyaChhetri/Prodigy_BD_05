-- CreateTable
CREATE TABLE `reservation` (
    `id` VARCHAR(191) NOT NULL,
    `reserverId` VARCHAR(191) NOT NULL,
    `listingId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reservation` ADD CONSTRAINT `reservation_reserverId_fkey` FOREIGN KEY (`reserverId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservation` ADD CONSTRAINT `reservation_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `listing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
