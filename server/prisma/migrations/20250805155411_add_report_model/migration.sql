-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('GENERATED', 'FAILED', 'IN_PROGRESS', 'BLOCKED', 'HIDDEN', 'ANSWERED');

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'GENERATED',
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
