/*
  Warnings:

  - A unique constraint covering the columns `[user_id,thread_id]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_user_id_thread_id_key" ON "public"."Like"("user_id", "thread_id");
