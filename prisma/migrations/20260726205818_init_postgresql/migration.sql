-- CreateEnum
CREATE TYPE "SalesPotential" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'ANALYZED', 'CONTACTED', 'RESPONDED', 'FOLLOW_UP', 'MEETING', 'PROPOSAL', 'CLOSED', 'LOST');

-- CreateEnum
CREATE TYPE "LeadResponse" AS ENUM ('NO_RESPONSE', 'POSITIVE', 'NEGATIVE', 'MORE_INFORMATION', 'CONTACT_LATER', 'MEETING_SCHEDULED', 'PROPOSAL_SENT', 'DEAL_CLOSED');

-- CreateEnum
CREATE TYPE "AIAnalysisStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "AIConfidence" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "RecommendedService" AS ENUM ('LANDING_PAGE', 'INSTITUTIONAL_SITE', 'CHATBOT', 'SCHEDULING_SYSTEM', 'CUSTOM_SYSTEM', 'DIGITAL_PRESENCE_REVIEW');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "phone" TEXT,
    "instagram" TEXT,
    "website" TEXT,
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER,
    "segment" TEXT,
    "city" TEXT,
    "salesPotential" "SalesPotential" NOT NULL DEFAULT 'MEDIUM',
    "websiteStatus" TEXT,
    "websiteScore" INTEGER,
    "mainProblem" TEXT,
    "suggestedSolution" TEXT,
    "personalizedMessage" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "contactedAt" TIMESTAMP(3),
    "followUpDate" TIMESTAMP(3),
    "response" "LeadResponse",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadAnalysis" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "status" "AIAnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "salesPotential" "SalesPotential",
    "websiteScore" INTEGER,
    "mainOpportunity" TEXT,
    "evidence" JSONB,
    "suggestedSolution" TEXT,
    "recommendedService" "RecommendedService",
    "approachMessage" TEXT,
    "followUpMessage" TEXT,
    "confidence" "AIConfidence",
    "model" TEXT,
    "sourceWebsite" TEXT,
    "websiteCheckedAt" TIMESTAMP(3),
    "analyzedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_businessName_idx" ON "Lead"("businessName");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_salesPotential_idx" ON "Lead"("salesPotential");

-- CreateIndex
CREATE INDEX "Lead_followUpDate_idx" ON "Lead"("followUpDate");

-- CreateIndex
CREATE INDEX "LeadAnalysis_leadId_idx" ON "LeadAnalysis"("leadId");

-- CreateIndex
CREATE INDEX "LeadAnalysis_status_idx" ON "LeadAnalysis"("status");

-- CreateIndex
CREATE INDEX "LeadAnalysis_analyzedAt_idx" ON "LeadAnalysis"("analyzedAt");

-- AddForeignKey
ALTER TABLE "LeadAnalysis" ADD CONSTRAINT "LeadAnalysis_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
