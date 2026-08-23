-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessName" TEXT NOT NULL,
    "phone" TEXT,
    "instagram" TEXT,
    "website" TEXT,
    "rating" REAL,
    "reviewCount" INTEGER,
    "segment" TEXT,
    "city" TEXT,
    "salesPotential" TEXT NOT NULL DEFAULT 'MEDIUM',
    "websiteStatus" TEXT,
    "websiteScore" INTEGER,
    "mainProblem" TEXT,
    "suggestedSolution" TEXT,
    "personalizedMessage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "contactedAt" DATETIME,
    "followUpDate" DATETIME,
    "response" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Lead_businessName_idx" ON "Lead"("businessName");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_salesPotential_idx" ON "Lead"("salesPotential");

-- CreateIndex
CREATE INDEX "Lead_followUpDate_idx" ON "Lead"("followUpDate");
