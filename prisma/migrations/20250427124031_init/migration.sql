/*
  Warnings:

  - You are about to drop the column `author_id` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `loser_id` on the `Task` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_author_id_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_loser_id_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "author_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "loser_id",
ADD COLUMN     "user_id" INTEGER,
ALTER COLUMN "description" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
