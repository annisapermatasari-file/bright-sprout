-- CreateEnum
CREATE TYPE "CourseSubject" AS ENUM ('MATH', 'SCIENCE', 'LANGUAGE');

-- AlterTable
ALTER TABLE "courses" ADD COLUMN "subject" "CourseSubject" NOT NULL DEFAULT 'MATH';
