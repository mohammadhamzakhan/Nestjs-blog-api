/*
  Warnings:

  - You are about to alter the column `title` on the `blogs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `slug` on the `blogs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `featureImageUrl` on the `blogs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.

*/
-- AlterTable
ALTER TABLE "public"."blogs" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "featureImageUrl" SET DATA TYPE VARCHAR(500);
