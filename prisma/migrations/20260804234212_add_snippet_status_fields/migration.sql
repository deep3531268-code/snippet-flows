-- AlterTable
ALTER TABLE "snippets" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_favorite" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "snippets_user_id_is_archived_deleted_at_idx" ON "snippets"("user_id", "is_archived", "deleted_at");
