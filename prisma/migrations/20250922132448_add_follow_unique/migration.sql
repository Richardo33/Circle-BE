/*
  Warnings:

  - A unique constraint covering the columns `[follower_id,following_id]` on the table `Following` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Following_follower_id_following_id_key" ON "public"."Following"("follower_id", "following_id");
