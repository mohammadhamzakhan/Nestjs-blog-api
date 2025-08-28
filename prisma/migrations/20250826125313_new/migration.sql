-- AlterTable
ALTER TABLE "public"."comments" ADD COLUMN     "userId" INTEGER;

-- CreateIndex
CREATE INDEX "comments_userId_idx" ON "public"."comments"("userId");

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
