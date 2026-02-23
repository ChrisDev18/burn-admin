-- CreateEnum
CREATE TYPE "OverrideAction" AS ENUM ('CANCEL', 'SWAP', 'ONE_OFF');

-- AlterTable
ALTER TABLE "ScheduleEntry" ADD COLUMN     "activeFrom" TIMESTAMP(3),
ADD COLUMN     "activeUntil" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ScheduleException" (
    "id" SERIAL NOT NULL,
    "scheduleEntryId" INTEGER,
    "radioShowId" INTEGER,
    "action" "OverrideAction" NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),

    CONSTRAINT "ScheduleException_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScheduleException" ADD CONSTRAINT "ScheduleException_scheduleEntryId_fkey" FOREIGN KEY ("scheduleEntryId") REFERENCES "ScheduleEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleException" ADD CONSTRAINT "ScheduleException_radioShowId_fkey" FOREIGN KEY ("radioShowId") REFERENCES "RadioShow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
