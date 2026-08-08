-- CreateTable
CREATE TABLE "activities" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "target_type" VARCHAR(20) NOT NULL,
    "action" VARCHAR(20) NOT NULL,
    "target_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activities_user_id_created_at_idx" ON "activities"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "activities_user_id_action_created_at_idx" ON "activities"("user_id", "action", "created_at" DESC);

-- CreateIndex
CREATE INDEX "activities_user_id_target_type_target_id_created_at_idx" ON "activities"("user_id", "target_type", "target_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
