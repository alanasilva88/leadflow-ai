CREATE TYPE "LeadSource" AS ENUM ('MANUAL', 'SPREADSHEET', 'GOOGLE_PLACES');

ALTER TABLE "Lead"
ADD COLUMN "source" "LeadSource" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN "externalPlaceId" TEXT,
ADD COLUMN "niche" TEXT,
ADD COLUMN "state" TEXT,
ADD COLUMN "formattedAddress" TEXT,
ADD COLUMN "googleMapsUrl" TEXT,
ADD COLUMN "businessStatus" TEXT,
ADD COLUMN "opportunityScore" INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX "Lead_externalPlaceId_key" ON "Lead"("externalPlaceId");
CREATE INDEX "Lead_source_idx" ON "Lead"("source");
CREATE INDEX "Lead_opportunityScore_idx" ON "Lead"("opportunityScore");
