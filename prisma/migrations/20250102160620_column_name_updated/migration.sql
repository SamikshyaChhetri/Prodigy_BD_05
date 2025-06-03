/*
  Warnings:

  - You are about to drop the column `no_of_vehicle` on the `listing` table. All the data in the column will be lost.
  - Added the required column `noOfVehicle` to the `listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `listing` DROP COLUMN `no_of_vehicle`,
    ADD COLUMN `noOfVehicle` INTEGER NOT NULL;
