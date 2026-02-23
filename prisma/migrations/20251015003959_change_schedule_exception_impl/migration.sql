/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduleException` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `overriding` to the `ScheduleEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ScheduleException" DROP CONSTRAINT "ScheduleException_radioShowId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleException" DROP CONSTRAINT "ScheduleException_scheduleEntryId_fkey";

-- AlterTable
ALTER TABLE "ScheduleEntry" ADD COLUMN     "overriding" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "ScheduleException";

-- DropEnum
DROP TYPE "OverrideAction";

-- CreateTable
CREATE TABLE "ScheduleCancellation" (
    "id" SERIAL NOT NULL,
    "scheduleEntryId" INTEGER,
    "weekDate" TIMESTAMP(3),

    CONSTRAINT "ScheduleCancellation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScheduleCancellation" ADD CONSTRAINT "ScheduleCancellation_scheduleEntryId_fkey" FOREIGN KEY ("scheduleEntryId") REFERENCES "ScheduleEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
