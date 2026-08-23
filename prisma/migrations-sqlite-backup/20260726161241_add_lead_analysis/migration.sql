-- CreateTable
CREATE TABLE "LeadAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "salesPotential" TEXT,
    "websiteScore" INTEGER,
    "mainOpportunity" TEXT,
    "evidence" JSONB,
    "suggestedSolution" TEXT,
    "recommendedService" TEXT,
    "approachMessage" TEXT,
    "followUpMessage" TEXT,
    "confidence" TEXT,
    "model" TEXT,
    "sourceWebsite" TEXT,
    "websiteCheckedAt" DATETIME,
    "analyzedAt" DATETIME,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LeadAnalysis_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "LeadAnalysis_leadId_idx" ON "LeadAnalysis"("leadId");

-- CreateIndex
CREATE INDEX "LeadAnalysis_status_idx" ON "LeadAnalysis"("status");

-- CreateIndex
CREATE INDEX "LeadAnalysis_analyzedAt_idx" ON "LeadAnalysis"("analyzedAt");
