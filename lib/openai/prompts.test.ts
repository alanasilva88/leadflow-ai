import assert from "node:assert/strict";
import test from "node:test";
import type { Lead } from "@prisma/client";
import { buildLeadAnalysisInput } from "./prompts";

test("constrói entrada limitada apenas com dados do lead", () => {
  const lead = {
    id: "x",
    businessName: "Negócio",
    segment: "a".repeat(200),
    city: "Cidade",
    phone: null,
    website: null,
    instagram: null,
    rating: null,
    reviewCount: null,
    salesPotential: "MEDIUM",
    status: "NEW",
    websiteStatus: null,
    websiteScore: null,
    mainProblem: null,
    suggestedSolution: null,
    personalizedMessage: null,
    contactedAt: null,
    followUpDate: null,
    response: null,
    notes: "n".repeat(1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Lead;
  const input = buildLeadAnalysisInput(lead, null);
  assert.equal(input.lead.segment?.length, 100);
  assert.equal(input.lead.notes?.length, 700);
  assert.equal(input.website, null);
  assert.equal("id" in input.lead, false);
});
